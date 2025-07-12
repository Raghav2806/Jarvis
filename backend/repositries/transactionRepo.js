import transactionModel from "../models/transactionsModel.js";
import cron from "node-cron";

export async function calculateNextDueDate(frequency, date, lastDate) {
  if (frequency === "Once") {
    return null;
  }
  const baseDate = new Date(date);
  baseDate.setHours(0, 0, 0, 0);
  const nextDate = new Date(baseDate);
  switch (frequency) {
    case "Monthly":
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case "Yearly":
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
    default:
      return null;
  }
  return nextDate;
}

export async function createTransaction(tranData) {
  const {
    userId,
    title,
    type,
    frequency,
    notes,
    currency,
    amount,
    date,
    category,
    method,
    methodId,
    lastDate,
  } = tranData;
  var isRecurring = false;
  if (frequency !== "Once") {
    isRecurring = true;
  }
  const baseDate = new Date(date);
  baseDate.setHours(0, 0, 0, 0);
  const baseLastDate = new Date(lastDate);
  baseLastDate.setHours(0, 0, 0, 0);
  const nextDate = await calculateNextDueDate(frequency, date);
  await transactionModel.create({
    userId: userId,
    title: title,
    type: type,
    frequency: frequency,
    amount: { currency: currency, value: amount },
    date: baseDate,
    category: category,
    paymentMethod: { methodType: method, sourceId: methodId },
    notes: notes,
    isRecurring: isRecurring,
    nextDueDate: nextDate,
    lastDate: baseLastDate,
  });
}

export async function getStatsByUserId(id) {
  const now = new Date();
  const firstOfTheMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  const firstOfNextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

  const nextYear = new Date(
    now.getFullYear() + 1,
    now.getMonth() + 1,
    now.getDate()
  );
  const pipeline = [
    { $match: { userId: id } },
    {
      $facet: {
        totalIncome: [
          { $match: { type: "Income" } },
          { $group: { _id: null, total: { $sum: "$amount.value" } } },
        ],
        totalExpense: [
          { $match: { type: "Expense" } },
          { $group: { _id: null, total: { $sum: "$amount.value" } } },
        ],
        categoryBreakdown: [
          { $group: { _id: "$category", total: { $sum: "$amount.value" } } },
          { $sort: { total: -1 } },
        ],
        paymentMethodBreakdown: [
          {
            $group: {
              _id: "$paymentMethod.methodType",
              total: { $sum: "$amount.value" },
            },
          },
          { $sort: { total: -1 } },
        ],
        thisMonthExpensePaid: [
          { $match: { type: "Expense", date: { $gte: firstOfTheMonth } } },
          { $group: { _id: "$title", total: { $sum: "$amount.value" } } },
        ],
        thisMonthExpenseDue: [
          {
            $match: {
              type: "Expense",
              nextDueDate: { $lte: firstOfNextMonth },
            },
          },
          { $group: { _id: "$title", total: { $sum: "$amount.value" } } },
        ],
        recentTransaction: [{ $sort: { data: -1 } }, { $limit: 5 }],
        monthlySubscriptionsPaid: [
          { $match: { type: "Subscription", date: { $gte: firstOfTheMonth } } },
          { $group: { _id: "$title", total: { $sum: "$amount.value" } } },
        ],
        monthlySubscriptionsDue: [
          {
            $match: {
              type: "Subscription",
              nextDueDate: { $lte: firstOfNextMonth },
            },
          },
          { $group: { _id: "$title", total: { $sum: "$amount.value" } } },
        ],
      },
    },
  ];
  const result = await transactionModel.aggregate(pipeline);
  return result[0];
}

cron.schedule("0 0 * * *", async () => {
  //minute hour date month day
  try {
    const todayMidnight = new Date();
    todayMidnight.setHours(0, 0, 0, 0);

    const tomorrowMidnight = new Date(todayMidnight);
    tomorrowMidnight.setDate(tomorrowMidnight.getDate() + 1);

    const transactionsToUpdate = await transactionModel.find({
      nextDueDate: { "$gte": todayMidnight, "$lt": tomorrowMidnight },
    });

    for (const transaction of transactionsToUpdate) {
      transaction.date = transaction.nextDueDate;
      if (
        transaction.nextDueDate?.getTime() >= transaction.lastDate?.getTime()
      ) {
        transaction.nextDueDate = null;
      } else {
        transaction.nextDueDate = await calculateNextDueDate(transaction.frequency, transaction.date);
        if(transaction.nextDueDate?.getTime() >= transaction.lastDate?.getTime()) {
          transaction.nextDueDate = null;
        }
      }
      await transaction.save();
    }
  } catch (err) {
    throw err;
  }
});

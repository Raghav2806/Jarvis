import transactionModel from "../models/transactionsModel.js";
import cron from "node-cron";

function utcDate(date) {
  const utc = new Date(date);
  utc.setUTCHours(0, 0, 0, 0);
  return utc;
}

export async function calculateNextDueDate(frequency, date, lastDate) {
  if (frequency === "Once") {
    return null;
  }
  const baseDate = utcDate(date);
  const nextDate = utcDate(baseDate);
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
  const baseDate = utcDate(date);
  let baseLastDate = null;
  if (lastDate) {
    baseLastDate = utcDate(lastDate);
  }
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
    now.getMonth(),
    now.getDate()
  );
  const pipeline = [
    { $match: { userId: id } },
    {
      $facet: {
        thisMonthIncomeRecieved: [
          {
            $match: {
              type: "Income",
              date: { $gte: firstOfTheMonth, $lte: now },
            },
          },
          {
            $group: {
              _id: "$amount.currency",
              total: { $sum: "$amount.value" },
            },
          },
        ],
        thisMonthIncomeDue: [
          {
            $match: {
              type: "Income",
              nextDueDate: { $lt: firstOfNextMonth, $gte: now },
            },
          },
          {
            $group: {
              _id: "$amount.currency",
              total: { $sum: "$amount.value" },
            },
          },
        ],
        futureThisMonthIncomeDue: [
          {
            $match: {
              type: "Income",
              date: { $lt: firstOfNextMonth, $gte: now },
            },
          },
          {
            $group: {
              _id: "$amount.currency",
              total: { $sum: "$amount.value" },
            },
          },
        ],
        monthIncomeBreakdown: [
          {
            $match: {
              type: "Income",
              date: { $gte: firstOfTheMonth, $lt: firstOfNextMonth },
            },
          },
          { $group: { _id: "$category", total: { $sum: "$amount.value" } } },
          { $sort: {total: -1}}
        ],
        thisMonthExpensePaid: [
          {
            $match: {
              type: "Expense",
              date: { $gte: firstOfTheMonth, $lte: now },
            },
          },
          {
            $group: {
              _id: "$amount.currency",
              total: { $sum: "$amount.value" },
            },
          },
        ],
        thisMonthExpenseDue: [
          {
            $match: {
              type: "Expense",
              nextDueDate: { $lt: firstOfNextMonth, $gte: now },
            },
          },
          {
            $group: {
              _id: "$amount.currency",
              total: { $sum: "$amount.value" },
            },
          },
        ],
        futureThisMonthExpenseDue: [
          {
            $match: {
              type: "Expense",
              date: { $lt: firstOfNextMonth, $gte: now },
            },
          },
          {
            $group: {
              _id: "$amount.currency",
              total: { $sum: "$amount.value" },
            },
          },
        ],
        monthExpenseBreakdown: [
          {
            $match: {
              type: "Expense",
              date: { $gte: firstOfTheMonth, $lt: firstOfNextMonth },
            },
          },
          { $group: { _id: "$category", total: { $sum: "$amount.value" } } },
          { $sort: {total: -1}}
        ],
        paymentMethodBreakdown: [
          {
            $match: {"paymentMethod.methodType":{$ne:null}}
          },
          {
            $group: {
              _id: "$paymentMethod.methodType",
              total: { $sum: "$amount.value" },
            },
          },
          { $sort: { total: -1 } },
        ],
        monthlySubscriptionsPaid: [
          {
            $match: {
              type: "Subscription",
              date: { $gte: firstOfTheMonth, $lte: now },
            },
          },
          {
            $group: {
              _id: "$amount.currency",
              amount: { $sum: "$amount.value" },
            },
          },
        ],
        monthlySubscriptionsDue: [
          {
            $match: {
              type: "Subscription",
              nextDueDate: { $lt: firstOfNextMonth, $gte: now },
            },
          },
          {
            $group: {
              _id: "$title",
              amount: { $sum: "$amount.value" }, //return next due date also
            },
          },
        ],
        recentTransaction: [{ $sort: { data: -1 } }, { $limit: 5 }],
      },
    },
  ];
  const result = await transactionModel.aggregate(pipeline);
  return result[0];
}

cron.schedule("0 0 * * *", async () => {
  //minute hour date month day
  try {
    const todayMidnight = utcDate();

    const tomorrowMidnight = utcDate(todayMidnight);
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
        transaction.nextDueDate = await calculateNextDueDate(
          transaction.frequency,
          transaction.date
        );
        if (
          transaction.nextDueDate?.getTime() >= transaction.lastDate?.getTime()
        ) {
          transaction.nextDueDate = null;
        }
      }
      await transaction.save();
    }
  } catch (err) {
    throw err;
  }
});

import transactionModel from "../models/transactionsModel.js";
import cron from "node-cron";
import nodemailer from "nodemailer";
import { findUserById } from "./userRepo.js";
import * as dotenv from "dotenv";
dotenv.config();

export function utcDate(date = new Date()) {
  const utc = new Date(date);
  if (isNaN(utc)) {
    throw new Error(`Invalid date passed to utcDate(): ${date}`);
  }
  utc.setUTCHours(0, 0, 0, 0);
  return utc;
}

export async function calculateNextDueDate(frequency, date) {
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
  const soon= new Date(now.getFullYear(), now.getMonth(), now.getDate()+10);
  
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
              type: { $ne: "Income"},
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
        monthExpenseBreakdown: [
          {
            $match: {
              type: { $ne: "Income"},
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
        subscriptionsDueDetails: [
          {
            $match: {
              type: "Subscription",
              $or: [
              {nextDueDate: { $lt: firstOfNextMonth, $gte: now }},
              {date: {$lt: firstOfNextMonth, $gte: now}}
              ]
            },
          },
          {
            $sort: {
              nextDueDate: 1
            }
          }
        ],
        expenseDueDetails: [
          {
            $match: {
              type: "Expense",
              nextDueDate: { $lt: firstOfNextMonth, $gte: now }, 
            },
          },
          {
            $sort: {
              nextDueDate: 1
            }
          }
        ],
        futureExpense: [
          {
            $match: {
              type: "Expense",
              date: { $lt: soon, $gte: now },
              
            },
          },
          {
            $sort: {
              date: 1
            }
          }
        ],
        incomeDueDetails: [
          {
            $match: {
              type: "Income",
              nextDueDate: { $lt: firstOfNextMonth, $gte: now },
            }
          },
          {
            $sort: {
              nextDueDate: 1,
            }
          }
        ],
        futureIncome: [
          {
            $match: {
              type: "Income",
              date: { $lt: soon, $gte: now },
            }
          },
          {
            $sort: {
              date: 1,
            }
          }
        ],
        totalNumberOfTransactions: [
          {$group : {_id: null, total: {$sum: 1}}}
        ],
        recentTransaction: [{$match: {date: {$lte: now}}},{ $sort: { date: -1 } }, { $limit: 10 }],
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
        transaction.lastDate = null;
      } else {
        transaction.nextDueDate = await calculateNextDueDate(
          transaction.frequency,
          transaction.date
        );
        if (
          transaction.nextDueDate?.getTime() > transaction.lastDate?.getTime()
        ) {
          transaction.nextDueDate = null;
          transaction.lastDate = null;
        }
      }
      await transaction.save();
    }
  } catch (err) {
    throw err;
  }
});

const transporter = nodemailer.createTransport({
  service: "gmail",
  host: "smtp.gmail.com",
  auth: {
    user: process.env.USER,
    pass: process.env.APP_PASSWORD,
  },
});

export async function sendEmail(transporter, mailOptions) {
  try {
    await transporter.sendMail(mailOptions);
  } catch (err) {
    throw new Error("Unable to send mail");
  }
}

cron.schedule("0 9 * * *", async() => {
  try {
    const todayMidnight = utcDate();

    const tomorrowMidnight = utcDate(todayMidnight);
    tomorrowMidnight.setDate(tomorrowMidnight.getDate() + 1);

    const dayAfterTomorrowMidnight = utcDate(tomorrowMidnight);
    dayAfterTomorrowMidnight.setDate(dayAfterTomorrowMidnight.getDate() + 1);

    const transactionsToSendEmail = await transactionModel.find({
        type: {$ne: "Income"},
        $or: [
        {nextDueDate: { $gte: tomorrowMidnight, $lt: dayAfterTomorrowMidnight }},
        {date: { $gte: tomorrowMidnight, $lt: dayAfterTomorrowMidnight }}
      ]
    });
    for(const transaction of transactionsToSendEmail) {
      const {userId}=transaction;
      const user=await findUserById(userId);
      
      if(user) {
        if(transaction.nextDueDate){
          let date = new Date(transaction.nextDueDate).toLocaleDateString("en-IN", {year: "numeric",month: "short",day: "numeric",});
        } else {
          let date = new Date(transaction.date).toLocaleDateString("en-IN", {year: "numeric",month: "short",day: "numeric",});
        }
        const reminderOptions= {
            from: {
                name: "Jarvis",
                address: process.env.USER,
            },
            to: user.email,
            subject: "Reminder: Payments coming up",
            text: 
            `Hey ${user.name},

            Just a heads-up! You have a payment due:

            • ${transaction.title} - ${transaction.amount.currency} ${transaction.amount.value}
            • Due on: ${date}

            - Jarvis 🔔
            `
        }
        await sendEmail(transporter, reminderOptions)
      } else {
        throw new Error(`User not found for transaction: ${transaction._id}`)
      }
    }
  } catch (err) {
    throw err;
  }
})
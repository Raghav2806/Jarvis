import transactionModel from "../models/transactionsModel.js";

export async function calculateNextDueDate(frequency, currentBaseDate) {
  if (frequency === "Once") {
    return null;
  }
  const nextDate = new Date(currentBaseDate);

  switch (frequency) {
    case "Daily":
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case "Weekly":
    case "Week":
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case "Monthly":
    case "Month":
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case "Yearly":
    case "Year":
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
    duration
  } = tranData;
  var isRecurring = false;
  if (frequency !== "Once") {
    isRecurring = true;
  }
  const baseDate = new Date(date);
  const nextDate = await calculateNextDueDate(frequency,baseDate)
  const lastdate = await calculateNextDueDate(duration,baseDate)
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
    lastDate: lastdate
  });
}

import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    type: {type: String, enum: ['Subscription','Expense','Income']}, 
    title: {type: String},
    amount: {
        value:{type: Number},
        currency:{type:String}
    },
    frequency: {type: String, enum: ['Once','Monthly','Yearly']},
    date: { type: Date, default: new Date() },
    category: {type: String, 
        enum: ['Entertainment', 'Groceries', 'Rent', 'Investment', 'Fuel', 'Medical', 'Dining', 'Shopping', 'Travel', 'Education', 'Salary', 'Electronics', 'Gambling', 'Mobile Recharge', 'Miscellaneous', 'Uncategorized'],
        default: 'Uncategorized'
    },

    paymentMethod: {
        methodType: {type: String, enum: ['card', 'bank', 'upi', 'cash']},
        sourceId: { type: mongoose.Schema.Types.ObjectId },
    },
    notes: {type: String},
    isRecurring: {type: Boolean},
    nextDueDate: { type: Date},
    lastDate: {type: Date}
});

const transactionModel = mongoose.model("transaction", transactionSchema);

export default transactionModel;
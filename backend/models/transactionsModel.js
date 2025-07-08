import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'user', required: true },
    type: {type: String, enum: ['subscription','expense','income','bill','reminder']}, 
    title: {type: String},
    amount: {type: Number},
    frequency: {type: String, enum: ['once','monthly','yearly']},
    date: { type: Date, default: new Date() },
    category: {type: String, 
        enum: ['entertainment','software subscription', 'groceries', 'rent', 'transport', 'fuel', 'medical', 'dining', 'shopping', 'travel', 'education', 'salary', 'miscellaneous', 'uncategorized'],
        default: 'uncategorized'
    },

    paymentMethod: {
        methodType: {type: String, enum: ['credit-card', 'netbanking', 'upi', 'cash']},
        sourceId: { type: mongoose.Schema.Types.ObjectId },
    },
    notes: {type: String},
    isRecurring: {type: Boolean},
    nextDueDate: { type: Date}
});

const transactionModel = mongoose.model("transaction", transactionSchema);

export default transactionModel;
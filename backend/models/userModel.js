import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {type: String, unique: true},
    password: {type: String},
    name: {type: String},
    googleId: {type: String},
    creditCards: [{
      name: String,      // e.g., "HDFC Regalia"
      last4: String,     // Optional: "1234"
      provider: String,  // e.g., "Visa", "Mastercard"
    }],
    bankAccounts: [{
      name: String,      // e.g., "ICICI NetBanking"
      bankName: String,  // Optional: "ICICI"
      accountType: String, // Optional: "Savings", "Current"
    }],
    upiIds: [{
      name: String,      // e.g., "GPay Personal"
      upi: String        // Optional: yourname@okhdfcbank
    }]
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
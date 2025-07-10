import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {type: String, unique: true},
    password: {type: String},
    name: {type: String},
    googleId: {type: String},
    imageUrl: {
      type: String,
      validate: {
        validator: function(v) {
          return /^https?:\/\/.+/.test(v);
        },
        message: props => `${props.value} is not a valid image URL!`
      }
    },
    creditCards: [{
      name: String,      // e.g., "HDFC Regalia"
      lastFour: {type: String},     // Optional: "1234"
      provider: String,  // e.g., "Visa", "Mastercard"
    }],
    bankAccounts: [{
      bankMethod: {type: String, enum:['Netbanking','Cheque','ECS','NEFT/RTGS/IMPS','Other']},
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
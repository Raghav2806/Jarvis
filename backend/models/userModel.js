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
      name: String,     
      lastFour: {type: String},     
      provider: String,  
    }],
    bankAccounts: [{
      bankMethod: {type: String, enum:['Netbanking','Cheque','ECS','NEFT/RTGS/IMPS','Other']},
      bankName: String,  
      accountType: String, 
    }],
    upiIds: [{
      name: String,      
      upi: String        
    }]
});

const userModel = mongoose.model("User", userSchema);

export default userModel;
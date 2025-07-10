import userModel from "../models/userModel.js";
import bcrypt from "bcryptjs";

const saltRounds=10;

export async function findUserByEmail (email) {
    return await userModel.findOne({email: email});
};

export async function findUserByGoogleId (id) {
    return await userModel.findOne({googleId: id});
};

export async function createUser (userData) {
    const hash=await bcrypt.hash(userData.password, saltRounds);
    const newUser= await userModel.create({email:userData.email, name:userData.name,password:hash});
    if(!newUser){
      throw new Error("User creation failed");
    }
    return newUser;
};

export async function searchCard (email,lastFour) {
    const user=await findUserByEmail(email);
    if(!user) throw new Error("User not found");
    const card = user.creditCards.find(card => card.lastFour === lastFour)
    return card || null
}

export async function addingCard (email,name,lastFour,provider) {
    const user=await findUserByEmail(email);
    if(!user) throw new Error("User not found");
    user.creditCards.push({name:name,lastFour:lastFour,provider:provider});
    await user.save();
}

export async function searchUpi (email,upi) {
    const user=await findUserByEmail(email);
    if(!user) throw new Error("User not found");
    const id = user.upiIds.find(id => id.upi === upi)
    return id || null
}

export async function addingUpi (email,name,upi) {
    const user=await findUserByEmail(email);
    if(!user) throw new Error("User not found");
    user.upiIds.push({name:name,upi:upi});
    await user.save();
}

export async function searchBank (email,bankName) {
    const user=await findUserByEmail(email);
    if(!user) throw new Error("User not found");
    const bank = user.bankAccounts.find(bank => bank.bankName === bankName)
    return bank || null
}

export async function addingBank (email,bankMethod,bankName,accountType) {
    const user=await findUserByEmail(email);
    if(!user) throw new Error("User not found");
    user.bankAccounts.push({bankMethod:bankMethod,bankName:bankName,accountType:accountType});
    await user.save();
}
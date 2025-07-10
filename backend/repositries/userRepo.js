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

export async function searchBank (email,bankName, bankMethod) {
    const user=await findUserByEmail(email);
    if(!user) throw new Error("User not found");
    const match = user.bankAccounts.find(bank => bank.bankName === bankName && bank.bankMethod === bankMethod)
    return match || null
}

export async function addingBank (email,bankMethod,bankName,accountType) {
    const user=await findUserByEmail(email);
    if(!user) throw new Error("User not found");
    user.bankAccounts.push({bankMethod:bankMethod,bankName:bankName,accountType:accountType});
    await user.save();
}

export async function getMethodFromId(user,id) {
    const card = user.creditCards.find(card => card._id.toString() === id)
    if(card) {
        return {detail:card, method:'card'}
    }
    const bank = user.bankAccounts.find(card => card._id.toString() === id)
    if(bank) {
        return {detail:bank, method:'bank'}
    }
    const upi = user.upiIds.find(card => card._id.toString() === id)
    if(upi) {
        return {detail:upi, method:'upi'}
    }
    throw new Error ('Could not find the method')
}

export async function updateCard (cardData) {
    const user=await findUserByEmail(cardData.email)
    const card = user.creditCards.find(card => card._id.toString() === cardData.id)
    if(card){
    card.name=cardData.name;
    card.lastFour=cardData.lastFour;
    card.provider=cardData.provider;
    await user.save();
    return
    } else {
        throw new Error("Can't find card");
    }
}

export async function updateBank (cardData) {
    const user=await findUserByEmail(cardData.email)
    const card = user.bankAccounts.find(card => card._id.toString() === cardData.id)
    if(card){
    card.bankName=cardData.bankName;
    card.bankMethod=cardData.bankMethod;
    card.accountType=cardData.accountType;
    await user.save();
    return
    } else {
        throw new Error("Can't find bank");
    }
}

export async function updateUpi (cardData) {
    const user=await findUserByEmail(cardData.email)
    const card = user.bankAccounts.find(card => card._id.toString() === cardData.id)
    if(card){
    card.name=cardData.name;
    card.upi=cardData.upi;
    await user.save();
    return
    } else {
        throw new Error("Can't find upi");
    }
}
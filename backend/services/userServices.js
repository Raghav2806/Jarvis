import {findUserByEmail, createUser, searchCard, addingCard, searchUpi, addingUpi, searchBank, addingBank} from "../repositries/userRepo.js"
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import * as dotenv from "dotenv";
dotenv.config();

export async function registerUser(userData) {
  try {
    const existingUser = await findUserByEmail(userData.email);
    if (existingUser) {
      throw new Error("User already exists");
    } else {
      await createUser(userData);
      return jwt.sign({ email: userData.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    }
  } catch (err) {
    throw err;
  }
}

export async function loginUser(userData) {
    try {
        const { email, password } = userData;
        const user= await findUserByEmail(email)
        if (!user) {
          throw new Error("User not found");
        } 
        if (user) {
            const valid= await bcrypt.compare(password, user.password);
            if (!valid) {
                throw new Error("Incorrect password");
            }
            return jwt.sign({ email: user.email }, process.env.JWT_SECRET, { expiresIn: '1h' });
    }
    } catch (err) {
      throw err;
    }
}

export async function addCard(methodData) {
  try {
    const {email,name,lastFour,provider}=methodData;
    const existingCard=await searchCard(email,lastFour);
    if(existingCard) {
      throw new Error("This card has already been added by you")
    } else {
      await addingCard(email,name,lastFour,provider)
    }
  } catch (err) {
    throw err;
  }
}

export async function addUpi(methodData) {
  try {
    const {email,name,upi}=methodData;
    const existingUpi=await searchUpi(email,upi);
    if(existingUpi) {
      throw new Error("This upi id has already been added by you")
    } else {
      await addingUpi(email,name,upi)
    }
  } catch (err) {
    throw err;
  }
}

export async function addBank(methodData) {
  try {
    const {email,bankMethod,bankName,accountType}=methodData;
    const existingCard=await searchBank(email,bankName);
    if(existingCard) {
      throw new Error("This bank has already been added by you")
    } else {
      await addingBank(email,bankMethod,bankName,accountType)
    }
  } catch (err) {
    throw err;
  }
}
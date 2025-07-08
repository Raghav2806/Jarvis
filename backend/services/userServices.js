import {findUserByEmail, createUser} from "../repositries/userRepo.js"
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
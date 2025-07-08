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
  try{
    const hash=await bcrypt.hash(userData.password, saltRounds);
    const newUser= await userModel.create({email:userData.email, password:hash, name:userData.name});
    return newUser;
  } catch(err) {
    console.error("Error in createUser:", err);
    throw new Error("User creation failed");
  }
};
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
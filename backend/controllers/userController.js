import {
    registerUser,
    loginUser
} from "../services/userServices.js";
import { ApiError } from "../errors/ApiError.js";
import * as dotenv from "dotenv";
dotenv.config();

export async function register(req, res, next) {
  try {
    const authToken = await registerUser(req.body);
    res
      .status(201)
      .json({ message: 'User created.',token: authToken });
  } catch (err) {
    next(ApiError.badRequest(err.message));
  }
}

export async function login(req, res, next) {
  try {
    const authToken = await loginUser(req.body);
    res
      .status(201)
      .json({ message: 'User found.',token: authToken });
  } catch (err) {
    next(ApiError.badRequest(err.message));
  }
}

export async function addMethod(req, res, next) {
  try {
    const method = req.params.method;
    console.log(method);
    console.log(req.body);
    res
      .status(201)
      .json({ message: 'Method added.'});
  } catch (err) {
    next(ApiError.badRequest(err.message));
  }
}
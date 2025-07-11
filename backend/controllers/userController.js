import {
    registerUser,
    loginUser,
    addCard,
    addUpi,
    addBank,
    getMethodDetails,
    updateMethodDetails,
    deleteMethodDetails
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
    switch (method) {
      case 'card':
        await addCard(req.body);
        break;
      case 'bank':
        await addBank(req.body);
        break;
      case 'upi':
        await addUpi(req.body);
        break;
      default:
        throw new Error("Invalid payment method");
    }
    res
      .status(201)
      .json({ message: 'Method added.'});
  } catch (err) {
    next(ApiError.badRequest(err.message));
  }
}

export async function getMethod(req, res, next) {
  try {
    const id=req.params.id;
    const email=req.query.email;
    const details = await getMethodDetails(email,id)
    
    res
      .status(201)
      .json(details);
  } catch (err) {
    next(ApiError.badRequest(err.message));
  }
}

export async function editMethod(req, res, next) {
  try {
    await updateMethodDetails(req.body)
    res
      .status(201)
      .json({ message: 'Method updated.'});
  } catch (err) {
    next(ApiError.badRequest(err.message));
  }
}

export async function deleteMethod(req, res, next) {
  try {
    await deleteMethodDetails(req.body.email,req.body.id)
    res
      .status(201)
      .json({message:'Method deleted'});
  } catch (err) {
    next(ApiError.badRequest(err.message));
  }
}

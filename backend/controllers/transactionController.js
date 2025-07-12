import {addingTransaction, getDashboardData} from "../services/transactionServices.js"
import { findUserById } from "../repositries/userRepo.js";
import { ApiError } from "../errors/ApiError.js";
import * as dotenv from "dotenv";
dotenv.config();

export async function addTransaction(req, res, next) {
  try {
    await addingTransaction(req.body)
    res
      .status(201)
      .json({ message: 'Transaction created.'});
  } catch (err) {
    next(ApiError.badRequest(err.message));
  }
}

export async function getStats(req, res, next) {
  try {
    const data = await getDashboardData(req.params.id)
    const user= await findUserById(req.params.id);
    res
      .status(201)
      .json({ message: 'Transaction created.', stats: data, user: user});
  } catch (err) {
    next(ApiError.badRequest(err.message));
  }
}
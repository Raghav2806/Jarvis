import {addingTransaction} from "../services/transactionServices.js"
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
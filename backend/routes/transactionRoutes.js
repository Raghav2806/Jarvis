import express from 'express'
import * as ctrl from '../controllers/transactionController.js';
export const transactRouter = express.Router();

transactRouter.post('/add',ctrl.addTransaction)
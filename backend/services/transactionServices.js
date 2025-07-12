import {createTransaction, getStatsByUserId} from "../repositries/transactionRepo.js"
import { findUserById, getMethodFromId } from "../repositries/userRepo.js";

export async function addingTransaction(tranData) {
    try {
        const user = await findUserById(tranData.userId)
        
        if(!user) {
            throw new Error("Could not find user")
        }
        if(tranData.type != 'Income') {
            if(tranData.method != 'cash') {
            const mode = await getMethodFromId(user,tranData.methodId)
            if(!mode) {
                throw new Error("Cannot find method details")
            }
        } else if(tranData.methodId){
            throw new Error("Cash cannot have method id")
        }
        }
        await createTransaction(tranData);
    } catch(err) {
        throw err;
    }
}

export async function getDashboardData(userId) {
    try {
        const user=await findUserById(userId);
        if(!user) {
            throw new Error("Incorrect Id, Cannot find User.")
        }
        return await getStatsByUserId(user._id);
    } catch (err) {
        throw err;
    }
}
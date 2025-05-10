import { Request, Response } from "express";
import {ethers} from 'ethers';

interface TransferRequest {
    amount: number;
    receiver_address: string;
    sender_address: string;
}

const isValidEVMAddress = (address: string) => ethers.isAddress(address);

const  transfer = (req: Request, res: Response) => {
    try {
        const transferRequest = <TransferRequest>req.body;

        if (!isValidEVMAddress(transferRequest.sender_address) || !isValidEVMAddress(transferRequest.receiver_address)) {
            res.status(422).json({message: "invalid EVM address"});
        }

        if (transferRequest.amount < 0) {
            res.status(422).json({message: "Amount must be greater than 0"});
        }

        res.status(200).json({message: "transfer accepted"})
    } catch (err) {
        const error = err as Error;

        console.error("transfer error: ", error.message);
        res.status(500).json({message: 'Error during transfer handling'});
    }
}

export {transfer}
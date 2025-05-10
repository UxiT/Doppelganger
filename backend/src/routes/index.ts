import express from "express"
import { ethers } from "ethers";

const router = express.Router()

const isValidEVMAddress = (address: string) => ethers.isAddress(address);
interface TransferRequest {
    amount: number;
    sender_address: string;
    receiver_address: string;
}

router.post('/v1/transfer', (req: express.Request, res: express.Response) => {
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
})

export default router

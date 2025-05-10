"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const lib_esm_1 = require("ethers/lib.esm");
const router = express_1.default.Router();
const isValidEVMAddress = (address) => lib_esm_1.ethers.isAddress(address);
router.post('/v1/transfer', (req, res) => {
    try {
        const transferRequest = req.body;
        if (!isValidEVMAddress(transferRequest.sender_address) || !isValidEVMAddress(transferRequest.receiver_address)) {
            res.status(422).json({ message: "invalid EVM address" });
        }
        if (transferRequest.amount < 0) {
            res.status(422).json({ message: "Amount must be greater than 0" });
        }
        res.status(200).json({ message: "transfer accepted" });
    }
    catch (err) {
        const error = err;
        console.error("transfer error: ", error.message);
        res.status(500).json({ message: 'Error during transfer handling' });
    }
});
exports.default = router;

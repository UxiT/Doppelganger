"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const smartContractRepository_1 = require("../respository/smartContractRepository");
function GetReceiverContract(amount) {
    return __awaiter(this, void 0, void 0, function* () {
        const filter = {
            minBalance: amount,
            lastCallAtTo: getLastCallTo(),
        };
        const contractsList = yield (0, smartContractRepository_1.getSmartContractsByFilter)(filter);
        if (contractsList.length === 0) {
            throw new Error(`No contract list found with balance ${amount}`);
        }
        return contractsList[Math.floor(Math.random() * contractsList.length)];
    });
}
function getLastCallTo() {
    const now = Date.now();
    const delta = Math.floor(Math.random() * 5) + 1;
    return new Date(now - delta);
}

import { SmartContract } from "../model/SmartContract";
async function getSmartContractsByFilter(filter) {
    const whereClause = {};
    if (filter.minBalance !== undefined) {
        whereClause.balance = { ...whereClause.balance, $gte: filter.minBalance };
    }
    if (filter.lastCallAtTo !== undefined) {
        whereClause.lastCallAtTo = { ...whereClause.lastCallAtTo, $lte: filter.lastCallAtTo };
    }
    return await SmartContract.findAll({ where: whereClause });
}
export { getSmartContractsByFilter };

import SmartContract from "../model/SmartContract"

type SmartContractListFilter = {
    minBalance?: number;
    lastCallAtTo?: Date;
}

async function getSmartContractsByFilter(filter: SmartContractListFilter): Promise<SmartContract[]> {
    const whereClause: any = {}

    if (filter.minBalance !== undefined) {
        whereClause.balance = {...whereClause.balance, $gte: filter.minBalance};
    }

    if (filter.lastCallAtTo !== undefined) {
        whereClause.lastCallAtTo = {...whereClause.lastCallAtTo, $lte: filter.lastCallAtTo};
    }

    return await SmartContract.findAll({where: whereClause})
}

export { getSmartContractsByFilter, type SmartContractListFilter };
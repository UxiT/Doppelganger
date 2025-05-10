import { getSmartContractsByFilter } from "../respository/smartContractRepository";
async function GetReceiverContract(amount) {
    const filter = {
        minBalance: amount,
        lastCallAtTo: getLastCallTo(),
    };
    const contractsList = await getSmartContractsByFilter(filter);
    if (contractsList.length === 0) {
        throw new Error(`No contract list found with balance ${amount}`);
    }
    return contractsList[Math.floor(Math.random() * contractsList.length)];
}
function getLastCallTo() {
    const now = Date.now();
    const delta = Math.floor(Math.random() * 5) + 1;
    return now - delta;
}

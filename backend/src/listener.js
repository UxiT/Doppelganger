import { ethers } from 'ethers';
import dotenv from 'dotenv';
import { Vault, sequelize, Intent, VaultMapping } from './models.js';

dotenv.config();

export async function setupListener() {
    const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
    const vaultABI = [
        "event TokensDeposited(address indexed from, uint256 amount)",
        "function permit(address wallet, uint256 amount)"
    ];
    const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

    const processEvents = async (vaultId, vaultContract) => {
        const transaction = await sequelize.transaction();

        try {
            const vault = await Vault.findOne({
                where: { id: vaultId },
                transaction
            });
            const fromBlock = vault.eventsBlockOffset ? parseInt(vault.eventsBlockOffset) : 0;
            const currentBlock = await provider.getBlockNumber();
            const adjustedFromBlock = currentBlock - fromBlock >= 500 ? currentBlock - 499 : fromBlock;

            console.log(`Blocks from ${adjustedFromBlock} to ${currentBlock}`);

            const events = await vaultContract.queryFilter(
                "TokensDeposited",
                adjustedFromBlock,
                currentBlock
            );

            console.log(events);

            for (const event of events) {
                const transactionId = event.transactionHash;
                const intent = await Intent.findOne({
                    where: { transactionId }
                });

                const vaultMapping = await VaultMapping.findOne({
                    where: { userId: intent.userId }
                });

                if (!vaultMapping) {
                    console.error(`Vault mapping not found for user ${intent.userId}`);
                    continue;
                }

                if (vaultMapping.internalVaultId === vaultId && intent) {
                    const externalVaultContract = new ethers.Contract(
                        vaultMapping.externalVault.address,
                        vaultABI,
                        provider
                    );

                    const permitTx = await externalVaultContract.connect(signer).permit(
                        intent.withdrawWalletAddress,
                        intent.amount
                    );
                    await permitTx.wait();

                    await intent.update({
                        permitTransactionId: permitTx.hash,
                        withdrawPermitted: true
                    }, { transaction });
                } else {
                    console.error('Mismatched deposit detected', transactionId);
                }
            }

            // Update the last processed block
            await vault.update({
                eventsBlockOffset: currentBlock.toString()
            }, { transaction });

            await transaction.commit();
        } catch (error) {
            await transaction.rollback();
            console.error(`Error processing events for vault ${vaultId}:`, error);
        }
    };

    // Upon application start, listen for events from all vaults in the database
    const vaults = await Vault.findAll();
    let contractsById = {};

    for (const vault of vaults) {
        const vaultContract = new ethers.Contract(
            vault.address,
            vaultABI,
            provider
        );
        contractsById[vault.id] = vaultContract;
    }

    const processVaults = async () => {
        for (const vault of vaults) {
            console.log(`Processing vault: ${vault.address}`);
            await processEvents(vault.id, contractsById[vault.id]);
        }
    }

    setInterval(processVaults, 60 * 1000); // each 1 minute
    await processVaults();
}

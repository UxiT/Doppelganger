import { ethers } from 'ethers';
import dotenv from 'dotenv';
import { Vault } from './models.js';

dotenv.config();


const provider = new ethers.JsonRpcProvider(process.env.ETHEREUM_RPC_URL);
const vaultABI = [
    "event TokensDeposited(address indexed from, uint256 amount)",
    "function permit(address wallet, uint256 amount)"
];

const signer = new ethers.Wallet(process.env.PRIVATE_KEY, provider);

// Upon application start, listen for events from all vaults in the database
const vaults = await Vault.findAll();
let vaultsAddressMap = new Set();

for (const vault of vaults) {
    vaultsAddressMap.add(vault.address);
}

for (const address of vaultsAddressMap) {
    console.log(`Processing vault: ${address}`);

    const vaultContract = new ethers.Contract(
        address,
        vaultABI,
        provider
    );

    // Listen for TokensDeposited events
    console.log(`Listening for TokensDeposited events on vault: ${address}`);
    vaultContract.on("TokensDeposited", async (from, amount, event) => {
        console.log(`TokensDeposited event: from ${from} amount ${amount} txHash: ${event.transactionHash}`);

        const intent = await Intent.findOne({
            where: {
                transactionId: event.transactionHash
            }
        });

        if (!intent) {
            console.log(`Intent not found for txHash: ${event.transactionHash}`);
            return;
        }

        const user = await User.findOne({
            where: {
                id: intent.userId
            }
        });

        if (!user) {
            console.log(`User not found for intent: ${intent.id}`);
            return;
        }

        const vaultContract = new ethers.Contract(
            user.externalWallet,
            vaultABI,
            signer
        );

        const tx = await vaultContract.permit(user.externalWallet, amount);
        console.log(`Permit transaction: ${tx.hash}`);

        tx.wait();

        await Intent.update({
            permitTransactionId: tx.hash,
            withdrawPermitted: true,
        }, {
            where: {
                id: intent.id
            }
        });
    });
}

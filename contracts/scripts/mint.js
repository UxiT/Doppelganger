const hre = require("hardhat");
import { config } from "dotenv";

config();

// Configuration parameters
const PRIVATE_KEY = process.env.PRIVATE_KEY;
const VAULT_TOKEN_ADDRESS = "0x3Ee8Ff2865d5202942c65e91BA537cc815dFA0Fd";
const RECEIVER_ADDRESS = "0x45f5609F5965FF9B2b45401D228440fd4a76b964";
const MINT_AMOUNT = "1"; // Amount in tokens

async function main() {
    // Create wallet from private key
    const wallet = new hre.ethers.Wallet(PRIVATE_KEY, hre.ethers.provider);
    console.log("Using wallet address:", wallet.address);

    // Get the contract instance
    const VaultToken = await hre.ethers.getContractFactory("VaultToken");
    const vaultToken = VaultToken.attach(VAULT_TOKEN_ADDRESS);

    // Convert amount to wei
    const amount = hre.ethers.parseEther(MINT_AMOUNT);

    console.log("Minting", MINT_AMOUNT, "tokens...");

    // Call mint function and wait for transaction
    const tx = await vaultToken.connect(wallet).mint(RECEIVER_ADDRESS, amount);
    console.log("Transaction hash:", tx.hash);

    // Wait for transaction to be mined
    const receipt = await tx.wait();
    console.log("Transaction confirmed in block:", receipt.blockNumber);
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });



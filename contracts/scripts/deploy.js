const hre = require("hardhat");

async function main() {
    const [deployer] = await hre.ethers.getSigners();
    console.log("Deploying contracts with the account:", deployer.address);

    // Deploy VaultToken first
    const VaultToken = await hre.ethers.getContractFactory("VaultToken");
    const vaultToken = await VaultToken.deploy(
        "Vault Token", // name
        "VTK",         // symbol
        hre.ethers.parseEther("0")
    );
    await vaultToken.waitForDeployment();
    console.log("VaultToken deployed to:", await vaultToken.getAddress());

    // Deploy Vault with the VaultToken address
    const Vault = await hre.ethers.getContractFactory("Vault");
    const vault = await Vault.deploy(await vaultToken.getAddress());
    await vault.waitForDeployment();
    console.log("Vault deployed to:", await vault.getAddress());
}

main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error(error);
        process.exit(1);
    });

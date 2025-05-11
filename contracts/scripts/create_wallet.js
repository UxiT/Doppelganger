const { ethers } = require("ethers");

const wallet = ethers.Wallet.createRandom();

console.log("address", wallet.address);
console.log("privateKey", wallet.privateKey);

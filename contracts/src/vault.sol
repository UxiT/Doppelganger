// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/access/Ownable.sol";
import "./token.sol";

contract Vault is Ownable {
    VaultToken public immutable token;

    // Mapping to track whitelisted addresses and their permitted amounts
    mapping(address => uint256) public permittedAmounts;

    // Events
    event TokensDeposited(address indexed from, uint256 amount);
    event TokensWithdrawn(address indexed to, uint256 amount);
    event AddressPermitted(address indexed wallet, uint256 amount);

    constructor(address _tokenAddress) Ownable(msg.sender) {
        token = VaultToken(_tokenAddress);
    }

    /**
     * @dev Allows users to deposit tokens into the vault
     * @param amount The amount of tokens to deposit
     */
    function deposit(uint256 amount) external {
        require(amount > 0, "Amount must be greater than 0");
        require(
            token.transferFrom(msg.sender, address(this), amount),
            "Transfer failed"
        );
        emit TokensDeposited(msg.sender, amount);
    }

    /**
     * @dev Allows whitelisted users to withdraw their permitted amount of tokens
     * @param amount The amount of tokens to withdraw
     * @param to The address to receive the tokens
     */
    function withdraw(uint256 amount, address to) external {
        require(amount > 0, "Amount must be greater than 0");
        require(
            permittedAmounts[msg.sender] >= amount,
            "Insufficient permitted amount"
        );
        require(to != address(0), "Invalid recipient address");

        permittedAmounts[msg.sender] -= amount;
        require(token.transfer(to, amount), "Transfer failed");

        emit TokensWithdrawn(to, amount);
    }

    /**
     * @dev Allows the owner to permit an address to withdraw a specific amount
     * @param wallet The address to permit
     * @param amount The amount to permit
     */
    function permit(address wallet, uint256 amount) external onlyOwner {
        require(wallet != address(0), "Invalid wallet address");
        require(amount > 0, "Amount must be greater than 0");

        permittedAmounts[wallet] = amount;
        emit AddressPermitted(wallet, amount);
    }
}

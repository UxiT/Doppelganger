export const vaultContract = {
  address: '0x5aD6FFDBf1A441C1f018204F2965e8018468Ed18',
  abi: [
    {
      type: 'function',
      name: 'deposit',
      stateMutability: 'nonpayable',
      inputs: [
        {
          name: 'amount',
          type: 'uint256',
        },
      ],
      outputs: [],
    },
    {
      type: 'function',
      name: 'withdraw',
      stateMutability: 'nonpayable',
      inputs: [
        {
          name: 'amount',
          type: 'uint256',
        },
        {
          name: 'to',
          type: 'address',
        }
      ],
      outputs: [],
    }
  ],
} as const

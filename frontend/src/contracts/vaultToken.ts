export const tokenContract = {
  address: '0x3Ee8Ff2865d5202942c65e91BA537cc815dFA0Fd',
  abi: [
    {
      type: 'function',
      name: 'allowance',
      stateMutability: 'view',
      inputs: [
        {
          name: 'owner',
          type: 'address',
        },
        {
          name: 'spender',
          type: 'address',
        },
      ],
      outputs: [{ type: 'uint256' }],
    },
    {
      type: 'function',
      name: 'approve',
      stateMutability: 'nonpayable',
      inputs: [
        {
          name: 'spender',
          type: 'address',
        },
        {
          name: 'value',
          type: 'uint256',
        },
      ],
      outputs: [{ type: 'bool' }],
    },
    {
      type: 'function',
      name: 'symbol',
      stateMutability: 'view',
      inputs: [],
      outputs: [{ type: 'string' }],
    },
  ],
}

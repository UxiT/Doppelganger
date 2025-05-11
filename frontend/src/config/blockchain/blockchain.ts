import { type AppKitNetwork, defineChain } from '@reown/appkit/networks'

export const siberium: AppKitNetwork = defineChain({
  id: 111000,
  name: 'Siberium Test Network',
  nativeCurrency: {
    name: 'TestSIBR',
    symbol: 'SIBR',
    decimals: 18,
  },
  rpcUrls: {
    default: {
      http: ['https://rpc.test.siberium.net'],
    },
  },
  blockExplorers: {
    default: {
      name: 'Siberium',
      url: 'https://explorer.test.siberium.net',
      apiUrl: 'https://explorer.test.siberium.net/api',
    },
  },
})

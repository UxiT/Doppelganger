import { WagmiAdapter } from '@reown/appkit-adapter-wagmi'
import { sepolia, type AppKitNetwork } from '@reown/appkit/networks'
import { siberium } from "@/config/blockchain/blockchain.ts";
import { sibrTestToken, sepoliaEth, type IToken } from "@/config/blockchain/tokens.ts";

export const projectId = import.meta.env.VITE_PROJECT_ID || 'b56e18d47c72ab683b10814fe9495694' // public project id for localhost only
if (!projectId) {
  throw new Error('VITE_PROJECT_ID is not set')
}

export const networks: [AppKitNetwork, ...AppKitNetwork[]] = [siberium, sepolia]

export const tokens: [...IToken[]] = [sibrTestToken, sepoliaEth]

export const wagmiAdapter = new WagmiAdapter({
  networks,
  projectId,
})

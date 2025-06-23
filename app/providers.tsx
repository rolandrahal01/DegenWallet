'use client'

import '@rainbow-me/rainbowkit/styles.css'
import { getDefaultConfig, RainbowKitProvider } from '@rainbow-me/rainbowkit'
import { WagmiProvider } from 'wagmi'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { mainnet, base, optimism, polygon, arbitrum } from 'wagmi/chains'

const config = getDefaultConfig({
  appName: 'DegenWallet',
  projectId: 'YOUR_PROJECT_ID', // get it for free at https://cloud.walletconnect.com
  chains: [mainnet, base, optimism, polygon, arbitrum],
  ssr: false,
})

const queryClient = new QueryClient()

export function Web3Providers({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={config}>
      <QueryClientProvider client={queryClient}>
        <RainbowKitProvider>{children}</RainbowKitProvider>
      </QueryClientProvider>
    </WagmiProvider>
  )
}

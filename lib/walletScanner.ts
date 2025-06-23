// lib/walletScanner.ts

// For now, just a mock function to simulate fetching top wallets.
// Later, replace with real web3 or API logic!
export async function fetchTopWallets(chain: string) {
  if (chain === 'eth') {
    return [
      { address: '0x123...', score: 99, winrate: 0.93, lastSeen: new Date() },
      { address: '0xabc...', score: 88, winrate: 0.88, lastSeen: new Date() },
    ]
  }
  return []
}

// lib/walletScanner.ts

export async function fetchTopWallets(chain: string) {
  // Demo data—replace with real API/Web3 logic later
  if (chain === 'eth') {
    return [
      { address: '0x123...', score: 99, winrate: 0.93, lastSeen: new Date() },
      { address: '0xabc...', score: 88, winrate: 0.88, lastSeen: new Date() },
    ];
  }
  return [];
}

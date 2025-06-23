import axios from "axios";

export async function fetchTopWallets(chain: string) {
  try {
    if (chain === "sol") {
      const { data: trending } = await axios.get(
        "https://public-api.birdeye.so/public/token/trending"
      );
      const token = trending.data[0];
      const { data: holders } = await axios.get(
        `https://public-api.birdeye.so/public/token/holder_list?address=${token.address}&offset=0&limit=5`
      );
      return holders.data.map((h: any) => ({
        address: h.address,
        amount: h.amount,
        token: token.symbol,
      }));
    }
    return [
      { address: "0x123...", score: 99, winrate: 0.93, lastSeen: new Date() },
      { address: "0xabc...", score: 88, winrate: 0.88, lastSeen: new Date() },
    ];
  } catch (error) {
    console.error("fetchTopWallets error:", error);
    return [{
      error: "Could not fetch wallets",
      details: error instanceof Error ? error.message : String(error)
    }];
  }
}

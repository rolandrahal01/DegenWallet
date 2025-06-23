import axios from "axios";

type Holder = {
  address: string
  amount: number
}

export async function fetchTopWallets(chain: string) {
  if (chain === "sol") {
    try {
      // Fetch trending tokens
      const trendingRes = await axios.get(
        "https://public-api.birdeye.so/public/token/trending"
      );
      const trending = trendingRes.data;
      if (!trending.data || trending.data.length === 0) {
        throw new Error("No trending tokens found.");
      }
      const token = trending.data[0];

      // Fetch top holders
      const holdersRes = await axios.get(
        `https://public-api.birdeye.so/public/token/holder_list?address=${token.address}&offset=0&limit=5`
      );
      const holders = holdersRes.data;

      if (!holders.data || holders.data.length === 0) {
        throw new Error("No holders found for trending token.");
      }

      return holders.data.map((h: Holder) => ({
        address: h.address,
        amount: h.amount,
        token: token.symbol,
      }));
    } catch (error) {
      console.error("fetchTopWallets error:", error);
      // Fallback to demo/mock data if anything fails
      return [
        { address: "0x123...", score: 99, winrate: 0.93, lastSeen: new Date() },
        { address: "0xabc...", score: 88, winrate: 0.88, lastSeen: new Date() },
      ];
    }
  }
  // fallback mock for eth or unknown chains
  return [
    { address: "0x123...", score: 99, winrate: 0.93, lastSeen: new Date() },
    { address: "0xabc...", score: 88, winrate: 0.88, lastSeen: new Date() },
  ];
}

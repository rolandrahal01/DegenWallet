// app/dashboard/page.tsx

'use client'

import React, { useEffect, useState } from 'react'

type Wallet = {
  address: string
  score?: number
  winrate?: number
  lastSeen?: string
  amount?: number
  token?: string
  error?: string
  details?: string
}

export default function Dashboard() {
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [loading, setLoading] = useState(true)

  const fetchWallets = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/wallets')
      const data = await res.json()
      setWallets(data)
    } catch (e) {
      setWallets([{ address: "Error", error: "Could not load wallets" }])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchWallets()
  }, [])

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-fuchsia-900 p-4 flex flex-col items-center">
      <h1 className="text-3xl md:text-5xl font-bold text-white mb-8 text-center drop-shadow-xl">
        DegenWallet AI Leaderboard
      </h1>
      <button
        onClick={fetchWallets}
        className="mb-6 px-6 py-2 rounded-xl text-lg bg-gradient-to-r from-pink-600 to-purple-700 text-white shadow hover:scale-105 transition"
      >
        Refresh
      </button>
      {loading ? (
        <div className="text-gray-300">Loading wallets...</div>
      ) : wallets.length === 0 ? (
        <div className="text-gray-400">No wallet data.</div>
      ) : (
        <div className="w-full max-w-2xl">
          <table className="w-full text-left bg-white/5 rounded-2xl overflow-hidden shadow-lg">
            <thead>
              <tr className="bg-black/30 text-fuchsia-300">
                <th className="py-3 px-4">Address</th>
                <th className="py-3 px-4">Score</th>
                <th className="py-3 px-4">Winrate</th>
                <th className="py-3 px-4">Last Seen</th>
                <th className="py-3 px-4">Amount</th>
                <th className="py-3 px-4">Token</th>
              </tr>
            </thead>
            <tbody>
              {wallets.map((w, i) => (
                <tr key={i} className="border-t border-fuchsia-900/30 hover:bg-fuchsia-900/10">
                  <td className="py-2 px-4 font-mono break-all">
                    {w.address}
                  </td>
                  <td className="py-2 px-4">
                    {typeof w.score === "number" ? w.score : "-"}
                  </td>
                  <td className="py-2 px-4">
                    {typeof w.winrate === "number"
                      ? `${Math.round(w.winrate * 100)}%`
                      : "-"}
                  </td>
                  <td className="py-2 px-4">
                    {w.lastSeen ? new Date(w.lastSeen).toLocaleString() : "-"}
                  </td>
                  <td className="py-2 px-4">
                    {typeof w.amount === "number" ? w.amount : "-"}
                  </td>
                  <td className="py-2 px-4">
                    {w.token || "-"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </main>
  )
}

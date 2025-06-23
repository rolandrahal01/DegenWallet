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
  const [copiedIdx, setCopiedIdx] = useState<number | null>(null)

  const fetchWallets = async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/wallets')
      const data = await res.json()
      setWallets(data)
    } catch {
      setWallets([{ address: "Error", error: "Could not load wallets" }])
    }
    setLoading(false)
  }

  useEffect(() => {
    fetchWallets()
  }, [])

  // Copy function
  const handleCopy = async (address: string, idx: number) => {
    await navigator.clipboard.writeText(address)
    setCopiedIdx(idx)
    setTimeout(() => setCopiedIdx(null), 1200)
  }

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
                  <td className="py-2 px-4 font-mono break-all flex items-center gap-2">
                    {w.address}
                    {w.address && w.address !== "Error" && (
                      <button
                        onClick={() => handleCopy(w.address, i)}
                        className="ml-2 px-2 py-1 text-xs bg-fuchsia-800/70 text-white rounded hover:bg-fuchsia-600 transition"
                        aria-label="Copy address"
                        type="button"
                      >
                        {copiedIdx === i ? "Copied!" : "Copy"}
                      </button>
                    )}
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

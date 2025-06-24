'use client'

import { useEffect, useState, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { isAdmin, hasActiveUnlock } from '@/lib/permissions'
import { useParams } from 'next/navigation'

type WalletStats = {
  pnl?: number
  totalTrades?: number
  // Extend as needed
}
type WalletTrade = {
  time: string
  token: string
  amount: number
  type: string
  txHash: string
}
type WalletDetails = {
  address: string
  isWhale?: boolean
  stats: WalletStats
  trades: WalletTrade[]
  insights?: string
  aiPrediction?: string
}

export default function WalletDetailPage() {
  const { address: queryAddress } = useParams() as { address: string }
  const { address: userAddress } = useAccount()
  const [mounted, setMounted] = useState(false)
  const [details, setDetails] = useState<WalletDetails | null>(null)
  const [premium, setPremium] = useState(false)
  const [admin, setAdmin] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    if (!mounted) return
    setPremium(userAddress ? hasActiveUnlock(userAddress) : false)
    setAdmin(userAddress ? isAdmin(userAddress) : false)
  }, [userAddress, mounted])

  const fetchWalletDetails = useCallback(async () => {
    const res = await fetch(`/api/wallets/${queryAddress}`)
    const data = await res.json()
    setDetails(data)
  }, [queryAddress])

  useEffect(() => { fetchWalletDetails() }, [fetchWalletDetails])

  if (!mounted || !details) {
    return <div className="text-center text-fuchsia-200 mt-10">Loading wallet data...</div>
  }

  const showAlpha = admin || premium || !details.isWhale

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-fuchsia-900 p-4 flex flex-col items-center">
      <h1 className="text-2xl md:text-4xl font-bold text-white mb-4 text-center drop-shadow-xl">
        Wallet: <span className="font-mono">{details.address}</span>
      </h1>
      {details.isWhale && !showAlpha && (
        <div className="mb-6 px-4 py-3 rounded bg-fuchsia-800 text-fuchsia-100 text-center max-w-md">
          <b>This is a whale wallet.</b> <br />
          <span className="text-fuchsia-200">Unlock premium to access full trading signals, AI predictions, and group alpha.</span>
        </div>
      )}
      <div className="w-full max-w-2xl">
        <table className="w-full mb-6 text-left bg-white/5 rounded-2xl overflow-hidden shadow-lg">
          <tbody>
            <tr>
              <td className="py-2 px-4 font-semibold text-fuchsia-200">Type</td>
              <td className="py-2 px-4">{details.isWhale ? "Whale" : "Degen"}</td>
            </tr>
            <tr>
              <td className="py-2 px-4 font-semibold text-fuchsia-200">Trades</td>
              <td className="py-2 px-4">{details.trades.length}</td>
            </tr>
            {/* Extend stats as needed */}
          </tbody>
        </table>
      </div>
      <div className="w-full max-w-2xl">
        <h2 className="text-lg text-fuchsia-300 font-semibold mb-2">Recent Trades</h2>
        <div className="bg-black/40 rounded-lg shadow p-4">
          <ul className="space-y-2">
            {details.trades.slice(0, showAlpha ? 20 : 5).map((t, i) => (
              <li key={i} className="font-mono text-xs text-white/90">
                {JSON.stringify(t)}
              </li>
            ))}
          </ul>
        </div>
      </div>
      {showAlpha && (
        <>
          <div className="mt-6 max-w-xl w-full">
            <div className="bg-fuchsia-900/80 rounded-xl p-4 mb-4 shadow">
              <h3 className="text-fuchsia-300 font-semibold mb-2">Alpha Insights</h3>
              <div className="text-white/90">{details.insights || "No alpha insights available yet."}</div>
            </div>
            <div className="bg-fuchsia-900/70 rounded-xl p-4 shadow">
              <h3 className="text-fuchsia-200 font-semibold mb-2">AI Prediction</h3>
              <div className="text-fuchsia-100">{details.aiPrediction || "No prediction at this time."}</div>
            </div>
          </div>
        </>
      )}
    </main>
  )
}

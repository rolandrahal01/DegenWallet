'use client'

import React, { useEffect, useState } from 'react'
import Link from 'next/link'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
import { isAdmin, hasActiveUnlock } from '@/lib/permissions'

type Wallet = {
  address: string
  score?: number
  winrate?: number
  lastSeen?: string
  amount?: number
  token?: string
  isWhale?: boolean // server marks whales
}

export default function Dashboard() {
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [loading, setLoading] = useState(true)
  const [mounted, setMounted] = useState(false)
  const { isConnected, address } = useAccount()
  const [premium, setPremium] = useState(false)
  const [admin, setAdmin] = useState(false)

  useEffect(() => { setMounted(true) }, [])
  useEffect(() => {
    if (!mounted) return
    setPremium(address ? hasActiveUnlock(address) : false)
    setAdmin(address ? isAdmin(address) : false)
  }, [address, mounted])

  useEffect(() => { fetchWallets() }, [])

  const fetchWallets = async () => {
    setLoading(true)
    const res = await fetch('/api/wallets')
    const data = await res.json()
    setWallets(data)
    setLoading(false)
  }

  if (!mounted) return null

  const showAlpha = admin || premium

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-fuchsia-900 p-4 flex flex-col items-center">
      <div className="w-full flex justify-end max-w-2xl pb-4">
        <ConnectButton />
      </div>
      <h1 className="text-3xl md:text-5xl font-bold text-white mb-2 text-center drop-shadow-xl">
        DegenWallet AI Dashboard
      </h1>
      <p className="text-fuchsia-200 mb-6 max-w-xl text-center">
        Real-time wallet tracking, memecoin signals & alpha. <span className="text-fuchsia-400 font-semibold">Free: See trending degen wallets. Premium: Unlock the whales.</span>
      </p>
      {admin && (
        <div className="mb-2 px-4 py-2 rounded bg-green-800 text-green-200 text-xs">
          <b>Admin mode:</b> All features unlocked.
        </div>
      )}
      {!admin && !premium && (
        <div className="mb-2 px-4 py-2 rounded bg-fuchsia-800/80 text-fuchsia-200 text-xs">
          <span className="font-semibold">Want whale wallets, AI signals, and secret alpha?</span>
          <Link href="/dashboard/unlock" className="underline ml-1 text-fuchsia-100">
            Unlock premium
          </Link>
        </div>
      )}
      <div className="w-full max-w-2xl">
        <table className="w-full text-left bg-white/5 rounded-2xl overflow-hidden shadow-lg">
          <thead>
            <tr className="bg-black/30 text-fuchsia-300">
              <th className="py-3 px-4">Address</th>
              <th className="py-3 px-4">Score</th>
              <th className="py-3 px-4">Winrate</th>
              <th className="py-3 px-4">Last Seen</th>
              <th className="py-3 px-4">Token</th>
              <th className="py-3 px-4">Insights</th>
            </tr>
          </thead>
          <tbody>
            {wallets.map((w, i) => {
              const locked = w.isWhale && !showAlpha
              return (
                <tr key={i} className="border-t border-fuchsia-900/30 hover:bg-fuchsia-900/10">
                  <td className="py-2 px-4 font-mono break-all">
                    {locked ? '************' : w.address}
                  </td>
                  <td className="py-2 px-4">
                    {locked ? '🔒' : (typeof w.score === "number" ? w.score : "-")}
                  </td>
                  <td className="py-2 px-4">
                    {locked ? '🔒' : (typeof w.winrate === "number" ? `${Math.round(w.winrate * 100)}%` : "-")}
                  </td>
                  <td className="py-2 px-4">
                    {locked ? '🔒' : (w.lastSeen ? new Date(w.lastSeen).toLocaleString() : "-")}
                  </td>
                  <td className="py-2 px-4">{locked ? '🔒' : (w.token || '-')}</td>
                  <td className="py-2 px-4">
                    <Link
                      href={`/dashboard/${w.address}`}
                      className={`px-2 py-1 rounded text-xs ${locked ? 'bg-fuchsia-800 text-fuchsia-200' : 'bg-fuchsia-600 text-white'} font-mono hover:scale-105 transition`}
                    >
                      {locked ? 'Unlock' : 'View'}
                    </Link>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </main>
  )
}

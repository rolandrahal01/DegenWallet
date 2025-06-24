'use client'

import React, { useEffect, useState } from 'react'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import { useAccount } from 'wagmi'
// @ts-expect-error
import QRCode from 'qrcode.react'

const SOL_RECEIVE_ADDR = 'DGpSu6ddVRx6VP8LyBbXz6iYiJNMzRdXeF8n1cDeqxUU'
const HELIUS_API_KEY = '4e108a23-5a5c-4987-8bf5-116a25f67d7a' // <-- just the key

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

const PAYWALL_STORAGE_KEY = 'degenwallet-premium-sol'

function hasActiveUnlock(pubkey: string): boolean {
  const stored = typeof window !== 'undefined' ? localStorage.getItem(PAYWALL_STORAGE_KEY + pubkey) : null
  if (!stored) return false
  const until = Number(stored)
  return until > Date.now()
}

function setUnlock(pubkey: string, hours = 24) {
  if (typeof window !== 'undefined') {
    localStorage.setItem(
      PAYWALL_STORAGE_KEY + pubkey,
      `${Date.now() + hours * 60 * 60 * 1000}`
    )
  }
}

export default function Dashboard() {
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [loading, setLoading] = useState(true)
  const [checkingPayment, setCheckingPayment] = useState(false)
  const [unlocked, setUnlocked] = useState(false)
  const { isConnected, address } = useAccount()
  const [paywallChecked, setPaywallChecked] = useState(false)

  // Core: check for payment on Solana chain
  async function checkSolPayment(userAddress: string) {
    setCheckingPayment(true)
    // Poll up to 12 times (60 seconds) for payment, stop if found.
    for (let tries = 0; tries < 12; tries++) {
      // Helius API: get all signatures to your paywall address
      const url = `https://mainnet.helius-rpc.com/?api-key=${HELIUS_API_KEY}`
      const body = {
        jsonrpc: '2.0',
        id: 'paycheck',
        method: 'getSignaturesForAddress',
        params: [
          SOL_RECEIVE_ADDR,
          { limit: 40 },
        ],
      }
      const res = await fetch(url, {
        method: 'POST',
        body: JSON.stringify(body),
        headers: { 'Content-Type': 'application/json' }
      })
      const data = await res.json()
      if (Array.isArray(data.result)) {
        for (const tx of data.result) {
          // Now fetch transaction detail:
          const txDetailBody = {
            jsonrpc: '2.0',
            id: 'paydetail',
            method: 'getTransaction',
            params: [
              tx.signature,
              { encoding: 'jsonParsed', commitment: 'confirmed' }
            ],
          }
          const txRes = await fetch(url, {
            method: 'POST',
            body: JSON.stringify(txDetailBody),
            headers: { 'Content-Type': 'application/json' }
          })
          const txData = await txRes.json()
          const transaction = txData?.result?.transaction?.message
          const instructions = transaction?.instructions || []
          for (const ix of instructions) {
            if (
              ix.parsed?.type === 'transfer' &&
              ix.parsed?.info?.destination === SOL_RECEIVE_ADDR &&
              ix.parsed?.info?.source === userAddress &&
              Number(ix.parsed?.info?.lamports) > 0
            ) {
              // Found payment!
              setUnlock(userAddress, 24) // Unlock for 24 hours
              setUnlocked(true)
              setCheckingPayment(false)
              setPaywallChecked(true)
              return true
            }
          }
        }
      }
      // Wait 5s before next poll
      await new Promise(res => setTimeout(res, 5000))
    }
    setCheckingPayment(false)
    setPaywallChecked(true)
    return false
  }

  // Check unlock status (cached)
  useEffect(() => {
    if (!address) {
      setUnlocked(false)
      setPaywallChecked(true)
      return
    }
    if (hasActiveUnlock(address)) {
      setUnlocked(true)
      setPaywallChecked(true)
    } else {
      setUnlocked(false)
      setPaywallChecked(true)
    }
  }, [address])

  // Fetch wallets after unlocking
  useEffect(() => {
    if (isConnected && unlocked) fetchWallets()
    // eslint-disable-next-line
  }, [isConnected, unlocked])

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

  // Copy function
  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text)
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-fuchsia-900 p-4 flex flex-col items-center">
      {/* Sticky Wallet Connect Button */}
      <div className="w-full flex justify-end max-w-2xl pb-4">
        <ConnectButton />
      </div>
      <h1 className="text-3xl md:text-5xl font-bold text-white mb-8 text-center drop-shadow-xl">
        DegenWallet AI Leaderboard
      </h1>
      {(!address || !isConnected) ? (
        <div className="mt-10 flex flex-col items-center">
          <div className="text-lg text-fuchsia-200 mb-4">
            Connect your Solana wallet to unlock the latest degen trading signals and alpha wallets.
          </div>
          <ConnectButton />
        </div>
      ) : (!unlocked && paywallChecked) ? (
        <div className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/90">
          <div className="bg-gradient-to-br from-fuchsia-900 to-fuchsia-700 rounded-3xl shadow-2xl p-8 max-w-md w-full flex flex-col items-center">
            <h2 className="text-2xl font-bold text-white mb-4 text-center">
              Pay to Unlock Alpha
            </h2>
            <div className="text-fuchsia-200 text-center mb-2">
              Send <span className="font-bold">any amount of SOL</span> to this address:<br />
              <span className="font-mono text-xs select-all break-all">{SOL_RECEIVE_ADDR}</span>
            </div>
            <div className="mb-4">
              <QRCode value={SOL_RECEIVE_ADDR} size={128} bgColor="#000" fgColor="#fff" />
            </div>
            <button
              className="mb-2 px-4 py-2 bg-fuchsia-700 text-white rounded hover:bg-fuchsia-600 font-mono"
              onClick={() => handleCopy(SOL_RECEIVE_ADDR)}
            >
              Copy Address
            </button>
            <div className="text-xs text-fuchsia-300 mb-3 text-center">
              After you pay, click below to check for payment.<br />
              (It may take up to 1 min to detect on-chain.)
            </div>
            <button
              className={`px-5 py-2 bg-green-700 text-white rounded-xl text-lg shadow transition ${checkingPayment ? 'opacity-60 cursor-not-allowed' : ''}`}
              onClick={() => checkSolPayment(address)}
              disabled={checkingPayment}
            >
              {checkingPayment ? 'Checking for payment...' : 'Check Payment'}
            </button>
            <div className="text-xs text-gray-400 mt-3">
              Your unlock is valid for 24h per wallet.
            </div>
          </div>
        </div>
      ) : (
        unlocked && (
          <>
            <div className="mb-2 text-green-400 text-xs text-right w-full max-w-2xl pr-2 truncate">
              Premium unlocked for: <span className="font-mono">{address}</span>
            </div>
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
                              onClick={() => handleCopy(w.address)}
                              className="ml-2 px-2 py-1 text-xs bg-fuchsia-800/70 text-white rounded hover:bg-fuchsia-600 transition"
                              aria-label="Copy address"
                              type="button"
                            >
                              Copy
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
          </>
        )
      )}
    </main>
  )
}

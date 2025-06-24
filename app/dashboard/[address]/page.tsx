'use client'
import React, { useEffect, useState, useCallback } from 'react'
import { useAccount } from 'wagmi'
import { isAdmin, hasActiveUnlock } from '@/lib/permissions'
import { useParams } from 'next/navigation'

type WalletStats = {
  pnl?: number
  totalTrades?: number
  // ...extend as needed
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

  if (!mounted || !details) return <div className="text-center text-fuchsia-200 mt-10">Loading wallet data...</div>

  const showAlpha = admin || premium || !details.isWhale

  // ... rest of your render code unchanged ...
}

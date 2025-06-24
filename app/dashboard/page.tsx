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
  isWhale?: boolean
}

export default function Dashboard() {
  const [wallets, setWallets] = useState<Wallet[]>([])
  const [mounted, setMounted] = useState(false)
  const { address } = useAccount()
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
    const res = await fetch('/api/wallets')
    const data = await res.json()
    setWallets(data)
  }

  if (!mounted) return null
  const showAlpha = admin || premium

  // ... rest of your render code unchanged ...
}

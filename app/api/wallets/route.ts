// app/api/wallets/route.ts

import { NextResponse } from 'next/server'
import { fetchTopWallets } from '@/lib/walletScanner'

export async function GET() {
  const data = await fetchTopWallets('eth')
  return NextResponse.json(data)
}

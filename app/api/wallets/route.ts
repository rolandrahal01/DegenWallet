// app/api/wallets/route.ts

import { NextRequest, NextResponse } from 'next/server'
import { fetchTopWallets } from '@/lib/walletScanner'

export async function GET(req: NextRequest) {
  // Example: get trending wallets on ETH
  const data = await fetchTopWallets('eth')
  return NextResponse.json(data)
}

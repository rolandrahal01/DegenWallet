// app/api/wallets/route.ts

import { NextRequest, NextResponse } from 'next/server'
// Use alias if configured, otherwise use relative path
import { fetchTopWallets } from '@/lib/walletScanner'
// or
// import { fetchTopWallets } from '../../lib/walletScanner'

export async function GET(req: NextRequest) {
  const data = await fetchTopWallets('eth')
  return NextResponse.json(data)
}

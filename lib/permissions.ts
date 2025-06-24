// lib/permissions.ts
export const ADMIN_ADDRESS = 'DGpSu6ddVRx6VP8LyBbXz6iYiJNMzRdXeF8n1cDeqxUU'
const PAYWALL_STORAGE_KEY = 'degenwallet-premium-sol'

export function isAdmin(address?: string) {
  return (address || '').toLowerCase() === ADMIN_ADDRESS.toLowerCase()
}

export function hasActiveUnlock(address?: string): boolean {
  if (!address || typeof window === 'undefined') return false
  const stored = localStorage.getItem(PAYWALL_STORAGE_KEY + address)
  if (!stored) return false
  return Number(stored) > Date.now()
}

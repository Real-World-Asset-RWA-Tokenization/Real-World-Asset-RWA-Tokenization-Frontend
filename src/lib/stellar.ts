import {
  isConnected as freighterIsConnected,
  getAddress,
  signTransaction,
} from '@stellar/freighter-api'

export async function checkWalletConnection(): Promise<boolean> {
  try {
    const result = await freighterIsConnected()
    return result.isConnected
  } catch {
    return false
  }
}

export async function getWalletAddress(): Promise<string | null> {
  try {
    const result = await getAddress()
    return result.address ?? null
  } catch {
    return null
  }
}

export async function getAccountBalance(_address: string): Promise<string> {
  return '0'
}

export { signTransaction }

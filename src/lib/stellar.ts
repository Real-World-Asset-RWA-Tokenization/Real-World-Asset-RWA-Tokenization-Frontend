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

export async function getAccountBalance(address: string): Promise<string> {
  try {
    const result = await getAddress()
    if (result.address === address) {
      return '0' // Placeholder: query ledger balance once Soroban RPC is integrated
    }
    return '0'
  } catch {
    return '0'
  }
}

export { signTransaction }

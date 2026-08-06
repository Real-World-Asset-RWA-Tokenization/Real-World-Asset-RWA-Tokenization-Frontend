import { Horizon } from 'stellar-sdk'

const BALANCE_TIMEOUT_MS = 8_000

/** Horizon endpoint used for on-chain balance lookups (override via .env). */
const HORIZON_URL = import.meta.env.VITE_HORIZON_URL ?? 'https://horizon-testnet.stellar.org'

/** Race a promise against a timeout so a flaky network can never hang the UI. */
function withTimeout<T>(promise: Promise<T>, ms: number): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`Operation timed out after ${ms}ms`)), ms)
    promise.then(
      (value) => {
        clearTimeout(timer)
        resolve(value)
      },
      (error) => {
        clearTimeout(timer)
        reject(error)
      },
    )
  })
}

/**
 * Fetches the native (XLM) balance for an address from Horizon.
 * Returns "0" when the account does not exist or the network is unreachable,
 * so the UI never crashes on flaky connectivity.
 *
 * This module is loaded on demand (dynamic import) to keep stellar-sdk out of
 * the initial bundle — it is only needed when a real wallet is connected.
 */
export async function getAccountBalance(address: string): Promise<string> {
  try {
    const server = new Horizon.Server(HORIZON_URL)
    const account = await withTimeout(server.loadAccount(address), BALANCE_TIMEOUT_MS)
    const native = account.balances.find((balance) => balance.asset_type === 'native')
    return native?.balance ?? '0'
  } catch {
    return '0'
  }
}

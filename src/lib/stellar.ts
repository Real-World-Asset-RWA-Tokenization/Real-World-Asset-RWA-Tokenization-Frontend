import {
  isConnected as freighterIsConnected,
  getAddress as freighterGetAddress,
  signTransaction,
} from '@stellar/freighter-api'

/**
 * Timeout applied to Freighter extension calls. Without the extension the
 * postMessage handshake never resolves, so we must fail fast instead of
 * blocking the UI with an infinite "Connecting wallet..." spinner.
 */
const WALLET_TIMEOUT_MS = 4_000

/**
 * Deterministic, well-formed Stellar public key used when the app runs in
 * demo mode (no Freighter extension installed). This lets judges, reviewers,
 * and CI explore every screen without wiring up a wallet.
 *
 * Note: this module deliberately avoids importing stellar-sdk so the heavy
 * SDK only loads on demand (see `stellar-account.ts`), keeping the initial
 * bundle small.
 */
export const DEMO_WALLET_ADDRESS = 'GBNFUWS2LJNFUWS2LJNFUWS2LJNFUWS2LJNFUWS2LJNFUWS2LJNFV3TR'

/**
 * Demo mode is enabled by default so the application is fully explorable
 * out of the box. Set `VITE_ENABLE_DEMO_MODE=false` to require a real
 * Freighter wallet for every session.
 */
export function isDemoModeEnabled(): boolean {
  return import.meta.env.VITE_ENABLE_DEMO_MODE !== 'false'
}

/** True when the Freighter extension has injected its global. */
function isFreighterAvailable(): boolean {
  return (
    typeof window !== 'undefined' &&
    Boolean((window as Window & { freighter?: unknown }).freighter)
  )
}

/** Race a promise against a timeout so third-party calls can never hang the UI. */
function withTimeout<T>(promise: Promise<T>, ms = WALLET_TIMEOUT_MS): Promise<T> {
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

/** Resolves true only when the Freighter extension is installed and reachable. */
export async function checkWalletConnection(): Promise<boolean> {
  if (!isFreighterAvailable()) return false
  try {
    const result = await withTimeout(freighterIsConnected())
    return Boolean(result.isConnected)
  } catch {
    return false
  }
}

/** Returns the connected Freighter address, or null when unavailable. */
export async function getWalletAddress(): Promise<string | null> {
  if (!isFreighterAvailable()) return null
  try {
    const result = await withTimeout(freighterGetAddress())
    return result.address || null
  } catch {
    return null
  }
}

export { signTransaction }

import { useState, useEffect, useCallback } from 'react'

interface RetryOptions {
  maxAttempts?: number
  baseDelay?: number
  maxDelay?: number
}

export async function withRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const { maxAttempts = 3, baseDelay = 1000, maxDelay = 10000 } = options
  let lastError: Error | null = null

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn()
    } catch (err) {
      lastError = err instanceof Error ? err : new Error(String(err))
      if (attempt < maxAttempts) {
        const delay = Math.min(baseDelay * Math.pow(2, attempt - 1), maxDelay)
        await new Promise((r) => setTimeout(r, delay))
      }
    }
  }
  throw lastError
}

export function useOnlineStatus() {
  const [isOnline, setIsOnline] = useState(
    typeof window !== 'undefined' ? navigator.onLine : true
  )

  useEffect(() => {
    function handleOnline() { setIsOnline(true) }
    function handleOffline() { setIsOnline(false) }
    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)
    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}

export function useAsyncAction<T = void>() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const execute = useCallback(async (fn: () => Promise<T>): Promise<T | null> => {
    setLoading(true)
    setError(null)
    try {
      const result = await fn()
      return result
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'An error occurred'
      setError(msg)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const clear = useCallback(() => { setError(null) }, [])

  return { loading, error, execute, clear }
}

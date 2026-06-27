import { describe, it, expect, vi } from 'vitest'
import { renderHook, act, waitFor } from '@testing-library/react'
import { withRetry, useAsyncAction, useOnlineStatus } from '@/lib/errors/retry'

describe('withRetry', () => {
  it('resolves on first attempt', async () => {
    const fn = vi.fn().mockResolvedValue('ok')
    await expect(withRetry(fn)).resolves.toBe('ok')
    expect(fn).toHaveBeenCalledTimes(1)
  })

  it('retries on failure and eventually succeeds', async () => {
    const fn = vi.fn()
      .mockRejectedValueOnce(new Error('fail'))
      .mockRejectedValueOnce(new Error('fail'))
      .mockResolvedValue('ok')
    await expect(withRetry(fn, { maxAttempts: 3, baseDelay: 10 })).resolves.toBe('ok')
    expect(fn).toHaveBeenCalledTimes(3)
  })

  it('throws after max attempts', async () => {
    const fn = vi.fn().mockRejectedValue(new Error('always fail'))
    await expect(withRetry(fn, { maxAttempts: 2, baseDelay: 10 })).rejects.toThrow('always fail')
    expect(fn).toHaveBeenCalledTimes(2)
  })
})

describe('useAsyncAction', () => {
  it('returns initial state', () => {
    const { result } = renderHook(() => useAsyncAction())
    expect(result.current.loading).toBe(false)
    expect(result.current.error).toBeNull()
  })

  it('executes successfully', async () => {
    const { result } = renderHook(() => useAsyncAction<string>())
    const value = await result.current.execute(() => Promise.resolve('done'))
    expect(value).toBe('done')
  })

  it('captures error on rejection', async () => {
    const { result } = renderHook(() => useAsyncAction())
    const promise = result.current.execute(() => Promise.reject(new Error('bad')))
    await expect(promise).resolves.toBeNull()
    await waitFor(() => expect(result.current.error).toBe('bad'))
  })

  it('clears error', async () => {
    const { result } = renderHook(() => useAsyncAction())
    await result.current.execute(() => Promise.reject(new Error('bad')))
    await waitFor(() => expect(result.current.error).toBe('bad'))
    act(() => result.current.clear())
    await waitFor(() => expect(result.current.error).toBeNull())
  })
})

describe('useOnlineStatus', () => {
  it('returns online by default in jsdom', () => {
    const { result } = renderHook(() => useOnlineStatus())
    expect(result.current).toBe(true)
  })
})

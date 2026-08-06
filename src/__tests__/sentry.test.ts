import { describe, it, expect, vi, beforeEach } from 'vitest'

// No VITE_SENTRY_DSN is set in the test environment, so the module
// should behave as "Sentry disabled" and never throw.
const captureExceptionMock = vi.fn()
vi.mock('@sentry/react', () => ({
  init: vi.fn(),
  captureException: (...args: unknown[]) => captureExceptionMock(...args),
  browserTracingIntegration: vi.fn(() => ({})),
  replayIntegration: vi.fn(() => ({})),
}))

describe('sentry', () => {
  let errorSpy: ReturnType<typeof vi.spyOn>

  beforeEach(() => {
    vi.clearAllMocks()
    errorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  it('initSentry is a no-op when no DSN is configured', async () => {
    const { initSentry } = await import('@/lib/errors/sentry')
    expect(() => initSentry()).not.toThrow()
  })

  it('captureError falls back to console when Sentry is disabled', async () => {
    const { captureError } = await import('@/lib/errors/sentry')
    captureError(new Error('boom'), { page: 'test' })
    expect(errorSpy).toHaveBeenCalledWith('[Sentry disabled]', expect.any(Error), { page: 'test' })
    expect(captureExceptionMock).not.toHaveBeenCalled()
  })

  it('captureError does not throw for non-Error values', async () => {
    const { captureError } = await import('@/lib/errors/sentry')
    expect(() => captureError('string error')).not.toThrow()
  })
})

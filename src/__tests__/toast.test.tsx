import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { render, screen, fireEvent, act } from '@testing-library/react'
import { ToastProvider, useToast } from '@/lib/errors/toast'

function Trigger() {
  const { addToast } = useToast()
  return <button onClick={() => addToast('Hello toast', 'success')}>show</button>
}

describe('ToastProvider', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  it('shows a toast and dismisses it on click', () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'show' }))
    expect(screen.getByText('Hello toast')).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: 'Dismiss' }))
    expect(screen.queryByText('Hello toast')).not.toBeInTheDocument()
  })

  it('auto-dismisses toasts after five seconds', () => {
    render(
      <ToastProvider>
        <Trigger />
      </ToastProvider>,
    )

    fireEvent.click(screen.getByRole('button', { name: 'show' }))
    expect(screen.getByText('Hello toast')).toBeInTheDocument()

    act(() => {
      vi.advanceTimersByTime(5000)
    })
    expect(screen.queryByText('Hello toast')).not.toBeInTheDocument()
  })
})

import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Toggle } from '@/components/ui/toggle'

describe('Toggle', () => {
  it('renders with correct aria-checked when enabled', () => {
    render(<Toggle enabled={true} onChange={() => {}} />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'true')
  })

  it('renders with correct aria-checked when disabled', () => {
    render(<Toggle enabled={false} onChange={() => {}} />)
    expect(screen.getByRole('switch')).toHaveAttribute('aria-checked', 'false')
  })

  it('calls onChange with toggled value', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<Toggle enabled={false} onChange={onChange} />)
    await user.click(screen.getByRole('switch'))
    expect(onChange).toHaveBeenCalledWith(true)
  })

  it('calls onChange with false when enabled', async () => {
    const onChange = vi.fn()
    const user = userEvent.setup()
    render(<Toggle enabled={true} onChange={onChange} />)
    await user.click(screen.getByRole('switch'))
    expect(onChange).toHaveBeenCalledWith(false)
  })
})

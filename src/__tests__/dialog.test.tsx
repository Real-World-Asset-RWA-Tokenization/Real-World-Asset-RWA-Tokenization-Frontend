import { describe, it, expect, vi } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { Dialog } from '@/components/ui/dialog'

describe('Dialog', () => {
  it('renders when open', () => {
    render(<Dialog open={true} onClose={vi.fn()}>Content</Dialog>)
    expect(screen.getByText('Content')).toBeInTheDocument()
  })

  it('does not render when closed', () => {
    render(<Dialog open={false} onClose={vi.fn()}>Content</Dialog>)
    expect(screen.queryByText('Content')).not.toBeInTheDocument()
  })

  it('shows title when provided', () => {
    render(<Dialog open={true} onClose={vi.fn()} title="My Title">Content</Dialog>)
    expect(screen.getByText('My Title')).toBeInTheDocument()
  })

  it('calls onClose when backdrop is clicked', () => {
    const onClose = vi.fn()
    render(<Dialog open={true} onClose={onClose}>Content</Dialog>)
    const backdrop = document.querySelector('.fixed.inset-0.bg-black\\/50')
    if (backdrop) fireEvent.click(backdrop)
    expect(onClose).toHaveBeenCalled()
  })

  it('calls onClose on Escape key', () => {
    const onClose = vi.fn()
    render(<Dialog open={true} onClose={onClose}>Content</Dialog>)
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(onClose).toHaveBeenCalled()
  })
})

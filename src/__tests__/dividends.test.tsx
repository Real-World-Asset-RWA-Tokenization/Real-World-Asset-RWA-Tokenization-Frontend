import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import Dividends from '@/pages/dividends'

vi.mock('@/lib/errors/toast', () => ({
  useToast: () => ({ addToast: vi.fn() }),
}))

describe('Dividends', () => {
  it('renders summary cards and distribution history', async () => {
    render(<Dividends />)

    expect(await screen.findByText('Total Distributed')).toBeInTheDocument()
    expect(screen.getByText('Total Distributions')).toBeInTheDocument()
    expect(screen.getByText('Pending', { exact: true })).toBeInTheDocument()

    // History table rows from demo data (some assets appear in multiple rows)
    expect(screen.getAllByText('Manhattan Prime Office').length).toBeGreaterThan(0)
    expect(screen.getAllByText('US Treasury Bill Fund').length).toBeGreaterThan(0)
  })
})

import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Spinner } from '@/components/ui/spinner'

describe('Spinner', () => {
  it('renders a spinner svg', () => {
    const { container } = render(<Spinner />)
    const svg = container.querySelector('svg')
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveClass('animate-spin')
  })

  it('applies custom className', () => {
    const { container } = render(<Spinner className="text-blue-600" />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveClass('text-blue-600')
  })

  it('sets size from prop', () => {
    const { container } = render(<Spinner size={32} />)
    const svg = container.querySelector('svg')
    expect(svg).toHaveStyle({ width: '32px', height: '32px' })
  })
})

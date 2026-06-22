import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/ui/button'

describe('Button', () => {
  it('renders children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  it('applies variant classes', () => {
    render(<Button variant="primary">Primary</Button>)
    const btn = screen.getByText('Primary')
    expect(btn.className).toContain('bg-blue-600')
  })

  it('shows spinner when loading', () => {
    const { container } = render(<Button loading>Loading</Button>)
    expect(screen.getByText('Loading')).toBeInTheDocument()
    expect(container.querySelector('svg')).toBeInTheDocument()
    expect(screen.getByText('Loading').closest('button')).toBeDisabled()
  })

  it('forwards disabled prop', () => {
    render(<Button disabled>Disabled</Button>)
    expect(screen.getByText('Disabled')).toBeDisabled()
  })
})

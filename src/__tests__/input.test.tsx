import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Input } from '@/components/ui/input'

describe('Input', () => {
  it('renders input element', () => {
    render(<Input />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders label when provided', () => {
    render(<Input id="test" label="Username" />)
    expect(screen.getByText('Username')).toBeInTheDocument()
  })

  it('shows error message', () => {
    render(<Input error="Required field" />)
    expect(screen.getByText('Required field')).toBeInTheDocument()
  })

  it('forwards value and onChange', () => {
    render(<Input value="hello" onChange={() => {}} />)
    expect(screen.getByRole('textbox')).toHaveValue('hello')
  })
})

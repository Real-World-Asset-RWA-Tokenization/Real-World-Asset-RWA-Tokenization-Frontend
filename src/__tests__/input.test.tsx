import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Input } from '@/components/ui/input'

describe('Input', () => {
  it('renders input element', () => {
    render(<Input id="test-input" />)
    const input = document.getElementById('test-input')
    expect(input).toBeInTheDocument()
    expect(input?.tagName).toBe('INPUT')
  })

  it('renders label htmlFor when provided', () => {
    render(<Input id="test" label="Username" />)
    const label = screen.getByText('Username')
    expect(label).toBeInTheDocument()
    expect(label.tagName).toBe('LABEL')
  })

  it('shows error message', () => {
    render(<Input error="Required field" />)
    expect(screen.getByText('Required field')).toBeInTheDocument()
  })

  it('forwards value and onChange', () => {
    render(<Input id="test-input" value="hello" onChange={() => {}} />)
    const input = document.getElementById('test-input') as HTMLInputElement
    expect(input).toHaveValue('hello')
  })
})

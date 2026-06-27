import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { ErrorBoundary } from '@/components/ui/error-boundary'

describe('ErrorBoundary', () => {
  it('renders children when no error', () => {
    render(
      <ErrorBoundary>
        <div>child content</div>
      </ErrorBoundary>,
    )
    expect(screen.getByText('child content')).toBeInTheDocument()
  })

  it('renders fallback UI when child throws', () => {
    const ThrowingComponent = () => { throw new Error('test error') }
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>,
    )
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('test error')).toBeInTheDocument()
    expect(screen.getByText('Reload Page')).toBeInTheDocument()
  })

  it('renders custom fallback when provided', () => {
    const ThrowingComponent = () => { throw new Error('test') }
    render(
      <ErrorBoundary fallback={<div>Custom Error</div>}>
        <ThrowingComponent />
      </ErrorBoundary>,
    )
    expect(screen.getByText('Custom Error')).toBeInTheDocument()
  })

  it('renders in a <main> landmark', () => {
    const ThrowingComponent = () => { throw new Error('test') }
    render(
      <ErrorBoundary>
        <ThrowingComponent />
      </ErrorBoundary>,
    )
    const main = document.querySelector('main')
    expect(main).toBeInTheDocument()
  })
})

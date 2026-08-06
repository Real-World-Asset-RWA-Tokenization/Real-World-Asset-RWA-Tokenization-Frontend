import { describe, it, expect, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeProvider, useTheme } from '@/components/theme/theme-provider'

function ThemeToggle() {
  const { theme, toggle } = useTheme()
  return <button onClick={toggle}>current: {theme}</button>
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('dark')
  })

  it('defaults to light theme', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    )
    expect(screen.getByText('current: light')).toBeInTheDocument()
  })

  it('toggles to dark, applies the class, and persists', () => {
    render(
      <ThemeProvider>
        <ThemeToggle />
      </ThemeProvider>,
    )
    fireEvent.click(screen.getByRole('button'))

    expect(screen.getByText('current: dark')).toBeInTheDocument()
    expect(document.documentElement.classList.contains('dark')).toBe(true)
    expect(localStorage.getItem('rwa_theme')).toBe('dark')
  })
})

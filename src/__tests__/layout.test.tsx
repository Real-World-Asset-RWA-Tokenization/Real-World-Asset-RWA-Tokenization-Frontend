import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import { MemoryRouter } from 'react-router'
import { Layout } from '@/components/layout/layout'

vi.mock('@/components/layout/header', () => ({
  Header: () => <header>mock header</header>,
}))

vi.mock('@/components/layout/sidebar', () => ({
  Sidebar: () => <nav>mock sidebar</nav>,
}))

describe('Layout', () => {
  it('renders the shell with a main landmark and skip link', () => {
    render(
      <MemoryRouter>
        <Layout />
      </MemoryRouter>,
    )
    expect(screen.getByText('mock header')).toBeInTheDocument()
    expect(screen.getByText('mock sidebar')).toBeInTheDocument()
    expect(screen.getByRole('main')).toHaveAttribute('id', 'main-content')
    expect(screen.getByText('Skip to content')).toBeInTheDocument()
  })
})

import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './header'
import { Sidebar } from './sidebar'
import { cn } from '@/lib/utils'

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [skipFocused, setSkipFocused] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <a
        href="#main-content"
        className={cn(
          'sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:rounded-lg focus:shadow-lg focus:outline-none',
          skipFocused && 'not-sr-only'
        )}
        onClick={() => setSkipFocused(false)}
        onFocus={() => setSkipFocused(true)}
        onBlur={() => setSkipFocused(false)}
      >
        Skip to content
      </a>
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="lg:pl-64">
        <Header onMenuToggle={() => setMenuOpen((prev) => !prev)} menuOpen={menuOpen} />
        <main id="main-content" className="p-4 lg:p-6" tabIndex={-1}>
          <Outlet />
        </main>
      </div>
    </div>
  )
}

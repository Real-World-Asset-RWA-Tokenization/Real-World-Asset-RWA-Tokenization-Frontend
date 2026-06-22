import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from './header'
import { Sidebar } from './sidebar'

export function Layout() {
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-900">
      <Sidebar open={menuOpen} onClose={() => setMenuOpen(false)} />
      <div className="lg:pl-64">
        <Header onMenuToggle={() => setMenuOpen((prev) => !prev)} menuOpen={menuOpen} />
        <main className="p-4 lg:p-6">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

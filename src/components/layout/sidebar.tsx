import { NavLink } from 'react-router-dom'
import {
  LayoutDashboard,
  Building2,
  Users,
  Banknote,
  Shield,
  Settings,
  X,
  type LucideIcon,
} from 'lucide-react'
import { cn } from '@/lib/utils'

const iconMap: Record<string, LucideIcon> = {
  LayoutDashboard,
  Building2,
  Users,
  Banknote,
  Shield,
  Settings,
}

const navItems = [
  { label: 'Dashboard', path: '/', icon: 'LayoutDashboard' },
  { label: 'Assets', path: '/assets', icon: 'Building2' },
  { label: 'Investors', path: '/investors', icon: 'Users' },
  { label: 'Dividends', path: '/dividends', icon: 'Banknote' },
  { label: 'Compliance', path: '/compliance', icon: 'Shield' },
  { label: 'Settings', path: '/settings', icon: 'Settings' },
]

interface SidebarProps {
  open?: boolean
  onClose?: () => void
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const content = (
    <div className="flex h-full flex-col">
      <div className="flex items-center justify-between px-4 pt-2 pb-2 lg:hidden">
        <span className="text-sm font-semibold text-slate-900 dark:text-white">Navigation</span>
        <button
          onClick={onClose}
          className="p-1 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
          aria-label="Close menu"
        >
          <X className="h-5 w-5 text-slate-500" />
        </button>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {navItems.map((item) => {
          const Icon = iconMap[item.icon]
          return (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/'}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-400'
                    : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200'
                )
              }
            >
              {Icon && <Icon className="h-5 w-5 flex-shrink-0" />}
              {item.label}
            </NavLink>
          )
        })}
      </nav>
      <div className="border-t p-4 dark:border-slate-800">
        <div className="rounded-lg bg-slate-50 p-3 dark:bg-slate-900">
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Network</p>
          <p className="text-sm font-semibold text-slate-900 dark:text-white">Stellar Testnet</p>
        </div>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:fixed lg:inset-y-0 lg:z-30 lg:flex lg:w-64 lg:flex-col">
        <div className="flex flex-col flex-1 border-r bg-white pt-20 dark:bg-slate-950 dark:border-slate-800">
          {content}
        </div>
      </aside>

      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
          <aside className="fixed inset-y-0 left-0 z-50 flex w-72 flex-col bg-white dark:bg-slate-950 shadow-2xl animate-in slide-in-from-left">
            {content}
          </aside>
        </div>
      )}
    </>
  )
}

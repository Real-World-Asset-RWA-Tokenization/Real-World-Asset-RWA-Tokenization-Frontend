import { WalletConnect } from '@/components/wallet/wallet-connect'
import { useTheme } from '@/components/theme/theme-provider'
import { APP_NAME } from '@/lib/constants'
import { Sun, Moon, Menu, X } from 'lucide-react'

interface HeaderProps {
  onMenuToggle?: () => void
  menuOpen?: boolean
}

export function Header({ onMenuToggle, menuOpen }: HeaderProps) {
  const { theme, toggle } = useTheme()

  return (
    <header className="sticky top-0 z-40 border-b bg-white/80 backdrop-blur-md dark:bg-slate-950/80 dark:border-slate-800">
      <div className="flex h-16 items-center justify-between px-4 lg:px-6">
        <div className="flex items-center gap-3">
          <button
            className="lg:hidden p-2 -ml-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            onClick={onMenuToggle}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X className="h-5 w-5 text-slate-700 dark:text-slate-300" /> : <Menu className="h-5 w-5 text-slate-700 dark:text-slate-300" />}
          </button>
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <svg className="h-5 w-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="hidden sm:block">
            <h1 className="text-sm font-semibold text-slate-900 dark:text-white">{APP_NAME}</h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">Stellar Soroban RWA Platform</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggle}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 cursor-pointer"
            aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
          >
            {theme === 'light' ? <Moon className="h-4 w-4 text-slate-600" /> : <Sun className="h-4 w-4 text-yellow-400" />}
          </button>
          <WalletConnect />
        </div>
      </div>
    </header>
  )
}

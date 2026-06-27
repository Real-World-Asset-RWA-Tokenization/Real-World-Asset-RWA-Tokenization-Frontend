import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from 'react'
import { cn } from '@/lib/utils'
import { Spinner } from '@/components/ui/spinner'

const variants = {
  default: 'bg-slate-900 text-white hover:bg-slate-800 shadow-xs dark:bg-slate-100 dark:text-slate-900 dark:hover:bg-slate-200',
  primary: 'bg-blue-600 text-white hover:bg-blue-700 shadow-xs dark:bg-blue-500 dark:hover:bg-blue-600',
  secondary: 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700',
  outline: 'border border-slate-300 bg-white hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:hover:bg-slate-800 dark:text-slate-300',
  ghost: 'hover:bg-slate-100 text-slate-700 dark:hover:bg-slate-800 dark:text-slate-400',
  danger: 'bg-red-600 text-white hover:bg-red-700 shadow-xs dark:bg-red-500 dark:hover:bg-red-600',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700 shadow-xs dark:bg-emerald-500 dark:hover:bg-emerald-600',
} as const

const sizes = {
  sm: 'h-8 px-3 text-xs gap-1.5',
  default: 'h-10 px-4 text-sm gap-2',
  lg: 'h-12 px-6 text-base gap-2',
  icon: 'h-10 w-10',
} as const

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: keyof typeof variants
  size?: keyof typeof sizes
  loading?: boolean
  children: ReactNode
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'default', size = 'default', loading, disabled, children, ...props }, ref) => (
    <button
      ref={ref}
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center rounded-lg font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 cursor-pointer',
        variants[variant],
        sizes[size],
        className
      )}
      {...props}
    >
      {loading ? (
        <>
          <Spinner size={16} />
          <span>{children}</span>
        </>
      ) : (
        children
      )}
    </button>
  ),
)
Button.displayName = 'Button'

export { Button, type ButtonProps }

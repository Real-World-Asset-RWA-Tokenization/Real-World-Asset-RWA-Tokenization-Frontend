import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

const variants = {
  default: 'bg-slate-100 text-slate-700 border-transparent dark:bg-slate-800 dark:text-slate-300',
  primary: 'bg-blue-100 text-blue-700 border-transparent dark:bg-blue-950 dark:text-blue-400',
  success: 'bg-emerald-100 text-emerald-700 border-transparent dark:bg-emerald-950 dark:text-emerald-400',
  warning: 'bg-amber-100 text-amber-700 border-transparent dark:bg-amber-950 dark:text-amber-400',
  danger: 'bg-red-100 text-red-700 border-transparent dark:bg-red-950 dark:text-red-400',
  outline: 'bg-transparent border-slate-300 text-slate-700 dark:border-slate-700 dark:text-slate-300',
} as const

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
  variant?: keyof typeof variants
  children: ReactNode
}

function Badge({ className, variant = 'default', children, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </span>
  )
}

export { Badge }

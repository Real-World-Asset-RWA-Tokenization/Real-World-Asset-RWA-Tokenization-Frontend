import type { HTMLAttributes, ReactNode } from 'react'
import { cn } from '@/lib/utils'

function Card({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('rounded-xl border bg-white shadow-sm dark:bg-slate-950 dark:border-slate-800', className)}
      {...props}
    />
  )
}

function CardHeader({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex flex-col gap-1.5 p-6', className)} {...props} />
}

function CardTitle({ className, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return <h3 className={cn('text-lg font-semibold leading-none tracking-tight dark:text-white', className)} {...props} />
}

function CardDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('text-sm text-slate-500 dark:text-slate-400', className)} {...props} />
}

function CardContent({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('p-6 pt-0', className)} {...props} />
}

function CardFooter({ className, ...props }: HTMLAttributes<HTMLDivElement>) {
  return <div className={cn('flex items-center p-6 pt-0', className)} {...props} />
}

interface StatCardProps {
  label: string
  value: string
  change?: string
  changeType?: 'positive' | 'negative' | 'neutral'
  icon?: ReactNode
}

function StatCard({ label, value, change, changeType = 'neutral', icon }: StatCardProps) {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{label}</p>
          {icon && <span className="text-slate-400">{icon}</span>}
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          <p className="text-2xl font-bold text-slate-900 dark:text-white">{value}</p>
          {change && (
            <span
              className={cn(
                'text-sm font-medium',
                changeType === 'positive' && 'text-emerald-600',
                changeType === 'negative' && 'text-red-600',
                changeType === 'neutral' && 'text-slate-500'
              )}
            >
              {change}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

export { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, StatCard }

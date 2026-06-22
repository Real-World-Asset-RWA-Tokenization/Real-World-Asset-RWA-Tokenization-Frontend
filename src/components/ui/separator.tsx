import { cn } from '@/lib/utils'

function Separator({ className }: { className?: string }) {
  return <div className={cn('h-px w-full bg-slate-200 dark:bg-slate-800', className)} />
}

export { Separator }

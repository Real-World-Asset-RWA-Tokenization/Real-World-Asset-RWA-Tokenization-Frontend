import type { HTMLAttributes, TdHTMLAttributes, ThHTMLAttributes } from 'react'
import { cn } from '@/lib/utils'

function Table({ className, ...props }: HTMLAttributes<HTMLTableElement>) {
  return (
    <div className="w-full overflow-auto">
      <table className={cn('w-full caption-bottom text-sm', className)} {...props} />
    </div>
  )
}

function TableHeader({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <thead className={cn('[&_tr]:border-b', className)} {...props} />
}

function TableBody({ className, ...props }: HTMLAttributes<HTMLTableSectionElement>) {
  return <tbody className={cn('[&_tr:last-child]:border-0', className)} {...props} />
}

function TableRow({ className, ...props }: HTMLAttributes<HTMLTableRowElement>) {
  return (
    <tr
      className={cn(
        'border-b border-slate-200 transition-colors hover:bg-slate-50/50 data-[state=selected]:bg-slate-100 dark:border-slate-800 dark:hover:bg-slate-900/50',
        className
      )}
      {...props}
    />
  )
}

function TableHead({ className, ...props }: ThHTMLAttributes<HTMLTableHeaderCellElement>) {
  return (
    <th
      className={cn(
        'h-12 px-4 text-left align-middle font-medium text-slate-500 text-xs uppercase tracking-wider dark:text-slate-400',
        className
      )}
      {...props}
    />
  )
}

function TableCell({ className, ...props }: TdHTMLAttributes<HTMLTableDataCellElement>) {
  return <td className={cn('p-4 align-middle', className)} {...props} />
}

export { Table, TableHeader, TableBody, TableRow, TableHead, TableCell }

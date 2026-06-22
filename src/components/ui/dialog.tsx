import { useEffect, useRef, type ReactNode, type KeyboardEvent } from 'react'
import { cn } from '@/lib/utils'

interface DialogProps {
  open: boolean
  onClose: () => void
  title?: string
  description?: string
  children: ReactNode
  className?: string
}

export function Dialog({ open, onClose, title, description, children, className }: DialogProps) {
  const dialogRef = useRef<HTMLDivElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  useEffect(() => {
    if (open) {
      previousFocusRef.current = document.activeElement as HTMLElement
      document.body.style.overflow = 'hidden'
      setTimeout(() => {
        dialogRef.current?.focus()
      }, 50)
    } else {
      document.body.style.overflow = 'unset'
      previousFocusRef.current?.focus()
    }
    return () => { document.body.style.overflow = 'unset' }
  }, [open])

  useEffect(() => {
    function handleEsc(e: globalThis.KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    if (open) window.addEventListener('keydown', handleEsc)
    return () => window.removeEventListener('keydown', handleEsc)
  }, [open, onClose])

  function handleKeyDown(e: KeyboardEvent<HTMLDivElement>) {
    if (e.key !== 'Tab') return
    const dialog = dialogRef.current
    if (!dialog) return
    const focusable = dialog.querySelectorAll<HTMLElement>(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    const first = focusable[0]
    const last = focusable[focusable.length - 1]

    if (e.shiftKey) {
      if (document.activeElement === first) {
        e.preventDefault()
        last?.focus()
      }
    } else {
      if (document.activeElement === last) {
        e.preventDefault()
        first?.focus()
      }
    }
  }

  if (!open) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      role="presentation"
    >
      <div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? 'dialog-title' : undefined}
        aria-describedby={description ? 'dialog-description' : undefined}
        tabIndex={-1}
        onKeyDown={handleKeyDown}
        className={cn(
          'relative z-50 w-full max-w-lg rounded-xl border bg-white p-6 shadow-2xl animate-in fade-in zoom-in-95 outline-none dark:bg-slate-950 dark:border-slate-800',
          className
        )}
      >
        {title && (
          <h2 id="dialog-title" className="text-lg font-semibold text-slate-900 dark:text-white">
            {title}
          </h2>
        )}
        {description && (
          <p id="dialog-description" className="mt-1 text-sm text-slate-500 dark:text-slate-400">
            {description}
          </p>
        )}
        <div className={title || description ? 'mt-4' : ''}>{children}</div>
      </div>
    </div>
  )
}

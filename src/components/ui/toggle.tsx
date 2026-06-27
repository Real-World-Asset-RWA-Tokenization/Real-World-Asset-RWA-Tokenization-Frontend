import { cn } from '@/lib/utils'

interface ToggleProps {
  enabled: boolean
  onChange: (enabled: boolean) => void
  id?: string
}

function Toggle({ enabled, onChange, id }: ToggleProps) {
  return (
    <button
      id={id}
      type="button"
      role="switch"
      aria-checked={enabled}
      className={cn(
        'relative inline-flex h-6 w-11 items-center rounded-full transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
        enabled ? 'bg-blue-600' : 'bg-slate-300 dark:bg-slate-600'
      )}
      onClick={() => onChange(!enabled)}
    >
      <span
        className={cn(
          'inline-block h-4 w-4 transform rounded-full bg-white transition-transform',
          enabled ? 'translate-x-6' : 'translate-x-1'
        )}
      />
    </button>
  )
}

export { Toggle }

import { cn } from '@/lib/utils'

interface CalloutProps {
  title?: string
  children: React.ReactNode
  variant?: 'info' | 'warning' | 'success' | 'neutral'
  className?: string
}

export function Callout({ title, children, variant = 'info', className }: CalloutProps) {
  return (
    <div
      className={cn(
        'rounded-lg p-4 border-l-4',
        variant === 'info' && 'bg-prBlue-50 dark:bg-prBlue-900/20 border-prBlue-500 text-prBlue-800 dark:text-prBlue-200',
        variant === 'warning' && 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-500 text-yellow-800 dark:text-yellow-200',
        variant === 'success' && 'bg-prGreen-50 dark:bg-prGreen-900/20 border-prGreen-500 text-prGreen-800 dark:text-prGreen-200',
        variant === 'neutral' && 'bg-gray-50 dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300',
        className
      )}
    >
      {title && <h4 className="font-semibold mb-1">{title}</h4>}
      <div className="text-sm">{children}</div>
    </div>
  )
}

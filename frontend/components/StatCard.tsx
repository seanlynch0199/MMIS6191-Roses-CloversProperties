import { cn } from '@/lib/utils'

interface StatCardProps {
  label: string
  value: string | number
  description?: string
  icon?: React.ReactNode
  className?: string
  variant?: 'default' | 'highlight' | 'accent'
}

export function StatCard({ label, value, description, icon, className, variant = 'default' }: StatCardProps) {
  return (
    <div
      className={cn(
        'rounded-xl p-6 transition-shadow hover:shadow-lg',
        variant === 'default' && 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
        variant === 'highlight' && 'bg-prBlue-500 text-white',
        variant === 'accent' && 'bg-prGreen-500 text-white',
        className
      )}
    >
      <div className="flex items-start justify-between">
        <div>
          <p
            className={cn(
              'text-sm font-medium',
              variant === 'default' ? 'text-gray-500 dark:text-gray-400' : 'text-white/80'
            )}
          >
            {label}
          </p>
          <p
            className={cn(
              'mt-2 text-3xl font-bold',
              variant === 'default' ? 'text-gray-900 dark:text-white' : 'text-white'
            )}
          >
            {value}
          </p>
          {description && (
            <p
              className={cn(
                'mt-1 text-sm',
                variant === 'default' ? 'text-gray-500 dark:text-gray-400' : 'text-white/70'
              )}
            >
              {description}
            </p>
          )}
        </div>
        {icon && (
          <div
            className={cn(
              'p-2 rounded-lg',
              variant === 'default' ? 'bg-gray-100 dark:bg-gray-700' : 'bg-white/20'
            )}
          >
            {icon}
          </div>
        )}
      </div>
    </div>
  )
}

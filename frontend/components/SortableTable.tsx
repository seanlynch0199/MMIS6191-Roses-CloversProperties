'use client'

import { useState, useMemo } from 'react'
import { cn } from '@/lib/utils'

interface Column<T> {
  key: keyof T | string
  label: string
  sortable?: boolean
  render?: (value: T[keyof T], row: T) => React.ReactNode
  className?: string
}

interface SortableTableProps<T> {
  data: T[]
  columns: Column<T>[]
  keyField: keyof T
  highlightTop?: number
}

type SortDirection = 'asc' | 'desc' | null

export function SortableTable<T extends object>({
  data,
  columns,
  keyField,
  highlightTop = 3,
}: SortableTableProps<T>) {
  const [sortKey, setSortKey] = useState<string | null>(null)
  const [sortDirection, setSortDirection] = useState<SortDirection>(null)

  const sortedData = useMemo(() => {
    if (!sortKey || !sortDirection) return data

    return [...data].sort((a, b) => {
      const aVal = (a as Record<string, unknown>)[sortKey]
      const bVal = (b as Record<string, unknown>)[sortKey]

      if (aVal === bVal) return 0

      let comparison = 0
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        comparison = aVal.localeCompare(bVal)
      } else if (typeof aVal === 'number' && typeof bVal === 'number') {
        comparison = aVal - bVal
      } else {
        comparison = String(aVal).localeCompare(String(bVal))
      }

      return sortDirection === 'desc' ? -comparison : comparison
    })
  }, [data, sortKey, sortDirection])

  const handleSort = (key: string) => {
    if (sortKey === key) {
      if (sortDirection === 'asc') {
        setSortDirection('desc')
      } else if (sortDirection === 'desc') {
        setSortDirection(null)
        setSortKey(null)
      }
    } else {
      setSortKey(key)
      setSortDirection('asc')
    }
  }

  return (
    <div className="overflow-x-auto print-full-width">
      <table className="w-full">
        <thead>
          <tr className="border-b-2 border-gray-200 dark:border-gray-700">
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={cn(
                  'text-left py-3 px-4 font-semibold text-gray-700 dark:text-gray-300',
                  column.sortable && 'cursor-pointer hover:text-prBlue-600 dark:hover:text-prBlue-400 select-none',
                  column.className
                )}
                onClick={() => column.sortable && handleSort(String(column.key))}
              >
                <div className="flex items-center gap-1">
                  {column.label}
                  {column.sortable && (
                    <span className="text-gray-400">
                      {sortKey === column.key ? (
                        sortDirection === 'asc' ? (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                          </svg>
                        ) : (
                          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        )
                      ) : (
                        <svg className="w-4 h-4 opacity-30" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                        </svg>
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, index) => {
            const isHighlighted = index < highlightTop
            return (
              <tr
                key={String(row[keyField])}
                className={cn(
                  'border-b border-gray-100 dark:border-gray-800',
                  isHighlighted && 'bg-prGreen-50/50 dark:bg-prGreen-900/10',
                  !isHighlighted && index % 2 === 0 && 'bg-white dark:bg-gray-900',
                  !isHighlighted && index % 2 === 1 && 'bg-gray-50/50 dark:bg-gray-800/50'
                )}
              >
                {columns.map((column) => (
                  <td
                    key={String(column.key)}
                    className={cn('py-3 px-4', column.className)}
                  >
                    {column.render
                      ? column.render((row as Record<string, unknown>)[column.key as string] as T[keyof T], row)
                      : String((row as Record<string, unknown>)[column.key as string] ?? '')}
                  </td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}

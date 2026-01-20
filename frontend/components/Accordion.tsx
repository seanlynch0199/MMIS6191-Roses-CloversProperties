'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

interface AccordionItem {
  title: string
  content: React.ReactNode
}

interface AccordionProps {
  items: AccordionItem[]
  allowMultiple?: boolean
  className?: string
}

export function Accordion({ items, allowMultiple = false, className }: AccordionProps) {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())

  const toggleItem = (index: number) => {
    const newOpenItems = new Set(openItems)
    if (newOpenItems.has(index)) {
      newOpenItems.delete(index)
    } else {
      if (!allowMultiple) {
        newOpenItems.clear()
      }
      newOpenItems.add(index)
    }
    setOpenItems(newOpenItems)
  }

  return (
    <div className={cn('divide-y divide-gray-200 dark:divide-gray-700 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden', className)}>
      {items.map((item, index) => {
        const isOpen = openItems.has(index)
        return (
          <div key={index}>
            <button
              onClick={() => toggleItem(index)}
              className="w-full px-4 py-3 flex items-center justify-between text-left bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
            >
              <span className="font-medium text-gray-900 dark:text-white">{item.title}</span>
              <svg
                className={cn('w-5 h-5 text-gray-500 transition-transform', isOpen && 'rotate-180')}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            {isOpen && (
              <div className="px-4 py-3 bg-gray-50 dark:bg-gray-900 text-gray-700 dark:text-gray-300 text-sm">
                {item.content}
              </div>
            )}
          </div>
        )
      })}
    </div>
  )
}

'use client'

import { useMemo } from 'react'
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts'
import { SeasonResult } from '@/data/types'
import { parseTimeToSeconds, formatDateShort } from '@/lib/utils'

interface SeasonProgressChartProps {
  results: SeasonResult[]
  event: string
}

export function SeasonProgressChart({ results, event }: SeasonProgressChartProps) {
  const chartData = useMemo(() => {
    return results
      .filter(r => r.event === event)
      .sort((a, b) => a.date.localeCompare(b.date))
      .map(r => ({
        date: formatDateShort(r.date),
        time: r.time,
        seconds: parseTimeToSeconds(r.time),
        meet: r.meetName,
      }))
  }, [results, event])

  if (chartData.length < 2) {
    return (
      <div className="h-48 flex items-center justify-center text-gray-500 dark:text-gray-400 text-sm">
        Not enough data for chart
      </div>
    )
  }

  const minSeconds = Math.min(...chartData.map(d => d.seconds))
  const maxSeconds = Math.max(...chartData.map(d => d.seconds))
  const padding = (maxSeconds - minSeconds) * 0.1

  return (
    <div className="h-48">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <XAxis
            dataKey="date"
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
          />
          <YAxis
            domain={[minSeconds - padding, maxSeconds + padding]}
            tick={{ fontSize: 12 }}
            tickLine={false}
            axisLine={{ stroke: '#e5e7eb' }}
            tickFormatter={(value) => {
              const mins = Math.floor(value / 60)
              const secs = Math.round(value % 60)
              return `${mins}:${secs.toString().padStart(2, '0')}`
            }}
            reversed
          />
          <Tooltip
            content={({ active, payload }) => {
              if (active && payload && payload.length) {
                const data = payload[0].payload
                return (
                  <div className="bg-white dark:bg-gray-800 p-2 rounded shadow-lg border border-gray-200 dark:border-gray-700">
                    <p className="font-semibold text-gray-900 dark:text-white">{data.time}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{data.meet}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{data.date}</p>
                  </div>
                )
              }
              return null
            }}
          />
          <Line
            type="monotone"
            dataKey="seconds"
            stroke="#0B3A6E"
            strokeWidth={2}
            dot={{ fill: '#0B3A6E', strokeWidth: 2, r: 4 }}
            activeDot={{ fill: '#1B7A3A', strokeWidth: 2, r: 6 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  )
}

'use client'

import { useState } from 'react'
import { HabitLog } from '@/types/habits'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, subMonths, addMonths } from 'date-fns'
import { vi } from 'date-fns/locale'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface CalendarViewProps {
  logs: HabitLog[]
}

export function CalendarView({ logs }: CalendarViewProps) {
  const [currentDate, setCurrentDate] = useState(new Date())

  const monthStart = startOfMonth(currentDate)
  const monthEnd = endOfMonth(currentDate)
  
  const completedDaysMap = new Set(
    logs.filter(log => log.completed).map(log => log.date)
  )
  const recordedDaysMap = new Set(
    logs.map(log => log.date)
  )

  const daysInMonth = eachDayOfInterval({
    start: monthStart,
    end: monthEnd
  })

  // Monday-based week (T2 = Mon, CN = Sun)  
  const startDayOfWeek = (monthStart.getDay() + 6) % 7
  const blanks = Array.from({ length: startDayOfWeek }).map((_, i) => i)

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1))
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1))

  const monthLabel = format(currentDate, 'MMMM yyyy', { locale: vi })

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-bold capitalize">{monthLabel}</h3>
        <div className="flex gap-1">
          <Button variant="ghost" size="icon" onClick={prevMonth} className="h-7 w-7 rounded-full">
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="icon" onClick={nextMonth} className="h-7 w-7 rounded-full">
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-7 mb-2">
        {['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'].map(day => (
          <div key={day} className="text-center text-[11px] font-semibold text-muted-foreground py-1">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5">
        {blanks.map(blank => (
          <div key={`blank-${blank}`} className="aspect-square p-0.5"></div>
        ))}
        
        {daysInMonth.map(day => {
          const dateStr = format(day, 'yyyy-MM-dd')
          const isCompleted = completedDaysMap.has(dateStr)
          const isRecorded = recordedDaysMap.has(dateStr)
          const isFuture = day > new Date()
          const isToday = isSameDay(day, new Date())
          
          let className = 'text-foreground/70'
          if (isCompleted) className = 'bg-primary text-primary-foreground font-semibold'
          else if (isRecorded && !isCompleted) className = 'bg-red-100 text-red-600 font-semibold'
          else if (isFuture) className = 'text-foreground/25'
          
          return (
            <div 
              key={dateStr} 
              className={`aspect-square flex items-center justify-center rounded-lg text-xs transition-colors
                ${className} 
                ${isToday && !isCompleted ? 'ring-2 ring-primary ring-offset-1 ring-offset-background font-bold' : ''}
              `}
              title={`${dateStr}${isCompleted ? ' - Hoàn thành' : ''}${isRecorded && !isCompleted ? ' - Bỏ lỡ' : ''}`}
            >
              {format(day, 'd')}
            </div>
          )
        })}
      </div>
      
      <div className="flex items-center gap-4 mt-4 text-[11px] text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-primary"></div>
          <span>Hoàn thành</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-red-400"></div>
          <span>Bỏ lỡ</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="h-2.5 w-2.5 rounded-full bg-muted"></div>
          <span>Chưa có</span>
        </div>
      </div>
    </div>
  )
}

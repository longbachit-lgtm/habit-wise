'use client'

import { useState } from 'react'
import { HabitWithLogs } from '@/types/habits'
import { checkIn } from '@/lib/habit-logs'
import { format } from 'date-fns'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'

const emojiMap: Record<string, string> = {
  blue: '💧',
  green: '🌿',
  purple: '📚',
  orange: '🏋️',
  rose: '🧘',
}

interface DailyCheckInProps {
  habits: HabitWithLogs[]
}

export function DailyCheckIn({ habits }: DailyCheckInProps) {
  const todayStr = format(new Date(), 'yyyy-MM-dd')
  
  const [completedMap, setCompletedMap] = useState<Record<string, boolean>>(() => {
    const map: Record<string, boolean> = {}
    habits.forEach(habit => {
      const todayLog = habit.logs.find(log => log.date === todayStr)
      map[habit.id] = todayLog?.completed ?? false
    })
    return map
  })

  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({})

  const handleCheckIn = async (habitId: string, checked: boolean) => {
    setCompletedMap(prev => ({ ...prev, [habitId]: checked }))
    setLoadingMap(prev => ({ ...prev, [habitId]: true }))

    const success = await checkIn(habitId, todayStr, checked)
    
    if (success) {
      if (checked) {
        toast.success('Tuyệt vời! Tiếp tục phát huy nhé! 🎉')
      }
    } else {
      toast.error('Lưu thất bại. Vui lòng thử lại.')
      setCompletedMap(prev => ({ ...prev, [habitId]: !checked }))
    }

    setLoadingMap(prev => ({ ...prev, [habitId]: false }))
  }

  if (habits.length === 0) {
    return (
      <Card>
        <CardContent className="p-6 text-center">
          <p className="text-sm text-muted-foreground">Bạn chưa có thói quen nào.</p>
        </CardContent>
      </Card>
    )
  }

  const completedCount = Object.values(completedMap).filter(Boolean).length

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center px-1">
        <span className="text-xs font-medium text-muted-foreground">Tiến độ hôm nay</span>
        <span className="text-xs font-bold text-primary">{completedCount} / {habits.length}</span>
      </div>

      <div className="space-y-2">
        {habits.map((habit) => {
          const isCompleted = completedMap[habit.id] || false
          const isLoading = loadingMap[habit.id] || false
          const emoji = emojiMap[habit.color] || '✅'

          return (
            <div 
              key={habit.id}
              className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 ${
                isCompleted ? 'bg-primary/5 border-primary/20' : 'bg-card hover:bg-muted/30 border-border/60'
              }`}
            >
              <Checkbox 
                id={`habit-${habit.id}`} 
                checked={isCompleted}
                disabled={isLoading}
                onCheckedChange={(checked) => handleCheckIn(habit.id, checked as boolean)}
                className="h-5 w-5 rounded-md"
              />
              <span className="text-base">{emoji}</span>
              <label 
                htmlFor={`habit-${habit.id}`}
                className={`text-sm font-medium leading-none cursor-pointer select-none flex-1 ${
                  isCompleted ? 'line-through text-muted-foreground' : ''
                }`}
              >
                {habit.name}
              </label>
            </div>
          )
        })}
      </div>
    </div>
  )
}

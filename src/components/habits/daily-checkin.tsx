'use client'

import { useState } from 'react'
import { HabitWithLogs } from '@/types/habits'
import { checkIn } from '@/lib/habit-logs'
import { format } from 'date-fns'
import { Checkbox } from '@/components/ui/checkbox'
import { toast } from 'sonner'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'

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

  const [dialogOpen, setDialogOpen] = useState(false)
  const [selectedHabit, setSelectedHabit] = useState<HabitWithLogs | null>(null)
  const [inputValue, setInputValue] = useState('')

  const handleCheckIn = async (habitId: string, checked: boolean, valueStr?: string) => {
    setLoadingMap(prev => ({ ...prev, [habitId]: true }))

    const value = valueStr ? parseInt(valueStr, 10) : 0
    const success = await checkIn(habitId, todayStr, checked, value)
    
    if (success) {
      setCompletedMap(prev => ({ ...prev, [habitId]: checked }))
      if (checked) {
        toast.success('Tuyệt vời! Tiếp tục phát huy nhé! 🎉')
      }
    } else {
      toast.error('Lưu thất bại. Vui lòng thử lại.')
    }

    setLoadingMap(prev => ({ ...prev, [habitId]: false }))
  }

  const openNumericDialog = (habit: HabitWithLogs) => {
    const todayLog = habit.logs.find(log => log.date === todayStr)
    setInputValue(todayLog ? todayLog.value.toString() : '0')
    setSelectedHabit(habit)
    setDialogOpen(true)
  }

  const handleNumericSave = () => {
    if (!selectedHabit) return
    
    const value = parseInt(inputValue, 10)
    if (isNaN(value) || value < 0) {
      toast.error('Vui lòng nhập một số hợp lệ.')
      return
    }

    // Mark as completed if value meets target
    const isCompleted = value >= selectedHabit.target_value
    
    // Close dialog and execute
    setDialogOpen(false)
    handleCheckIn(selectedHabit.id, isCompleted, inputValue)
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
          const isNumeric = habit.type === 'numeric'
          const todayLog = habit.logs.find(log => log.date === todayStr)
          const currentValue = todayLog ? todayLog.value : 0

          return (
            <div 
              key={habit.id}
              className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all duration-200 ${
                isCompleted ? 'bg-primary/5 border-primary/20' : 'bg-card hover:bg-muted/30 border-border/60'
              }`}
            >
              {isNumeric ? (
                <Button
                  variant={isCompleted ? "default" : "outline"}
                  size="sm"
                  className={`h-6 text-xs px-2 ${isCompleted ? 'bg-primary text-primary-foreground' : ''}`}
                  disabled={isLoading}
                  onClick={() => openNumericDialog(habit)}
                >
                  {isCompleted ? 'Hoàn thành' : 'Nhập'}
                </Button>
              ) : (
                <Checkbox 
                  id={`habit-${habit.id}`} 
                  checked={isCompleted}
                  disabled={isLoading}
                  onCheckedChange={(checked) => handleCheckIn(habit.id, checked as boolean)}
                  className="h-5 w-5 rounded-md"
                />
              )}

              <span className="text-base">{emoji}</span>
              
              <div className="flex flex-col flex-1 overflow-hidden">
                <label 
                  htmlFor={`habit-${habit.id}`}
                  className={`text-sm font-medium leading-none cursor-pointer select-none truncate ${
                    isCompleted ? 'line-through text-muted-foreground' : ''
                  }`}
                  onClick={() => {
                    if (isNumeric) openNumericDialog(habit)
                    else handleCheckIn(habit.id, !isCompleted)
                  }}
                >
                  {habit.name}
                </label>
                {isNumeric && (
                  <span className="text-[10px] text-muted-foreground mt-1">
                    {currentValue} / {habit.target_value} {habit.unit}
                  </span>
                )}
              </div>
            </div>
          )
        })}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Cập nhật số lượng</DialogTitle>
            <DialogDescription>
              Nhập số lượng bạn đã đạt được cho thói quen <strong>{selectedHabit?.name}</strong> hôm nay.
              <br/>Mục tiêu: {selectedHabit?.target_value} {selectedHabit?.unit}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="numeric_value" className="text-right">
                Số lượng
              </Label>
              <Input
                id="numeric_value"
                type="number"
                min="0"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="col-span-3"
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleNumericSave()
                  }
                }}
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setDialogOpen(false)}>Hủy</Button>
            <Button type="button" onClick={handleNumericSave}>Lưu</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

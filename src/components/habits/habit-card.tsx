import { HabitWithLogs } from '@/types/habits'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { calculateStreak } from '@/lib/streaks'
import { Flame, PartyPopper } from 'lucide-react'
import Link from 'next/link'

const emojiMap: Record<string, string> = {
  blue: '💧',
  green: '🌿',
  purple: '📚',
  orange: '🏋️',
  rose: '🧘',
}

const colorMap: Record<string, { bg: string; border: string }> = {
  blue: { bg: 'bg-blue-50', border: 'border-blue-100' },
  green: { bg: 'bg-emerald-50', border: 'border-emerald-100' },
  purple: { bg: 'bg-purple-50', border: 'border-purple-100' },
  orange: { bg: 'bg-orange-50', border: 'border-orange-100' },
  rose: { bg: 'bg-rose-50', border: 'border-rose-100' },
}

interface HabitCardProps {
  habit: HabitWithLogs
}

export function HabitCard({ habit }: HabitCardProps) {
  const { current, completedDays } = calculateStreak(habit.logs)
  const progressPercent = Math.min(Math.round((completedDays / habit.target_days) * 100), 100)
  const isChallengeCompleted = completedDays >= habit.target_days
  const emoji = emojiMap[habit.color] || '✅'
  const colors = colorMap[habit.color] || colorMap.blue

  return (
    <Link href={`/habits/${habit.id}`}>
      <Card className="hover:shadow-lg hover:shadow-primary/5 transition-all duration-200 cursor-pointer h-full border-border/60 hover:border-primary/30 group">
        <CardContent className="p-5">
          {/* Header: Emoji + Badge */}
          <div className="flex items-start justify-between mb-4">
            <div className={`h-11 w-11 rounded-xl ${colors.bg} ${colors.border} border flex items-center justify-center text-xl`}>
              {emoji}
            </div>
            {isChallengeCompleted && (
              <span className="text-[11px] bg-primary text-primary-foreground px-2.5 py-1 rounded-full font-semibold uppercase tracking-wider flex items-center gap-1">
                Xong
              </span>
            )}
          </div>

          {/* Name + Description */}
          <h3 className="font-bold text-base mb-1 group-hover:text-primary transition-colors line-clamp-1">
            {habit.name}
          </h3>
          {habit.description && (
            <p className="text-xs text-muted-foreground mb-3 line-clamp-1">
              Mục tiêu: {habit.description}
            </p>
          )}
          {!habit.description && (
            <p className="text-xs text-muted-foreground mb-3">
              Mục tiêu: {habit.target_days} ngày
            </p>
          )}

          {/* Streak */}
          {current > 0 && (
            <div className="flex items-center gap-1 text-xs text-orange-600 font-medium mb-3">
              <Flame className="h-3.5 w-3.5" />
              Duy trì {current} ngày
            </div>
          )}

          {/* Progress */}
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-muted-foreground">{completedDays} / {habit.target_days} ngày</span>
            <span className="font-semibold text-primary">{progressPercent}%</span>
          </div>
          <Progress value={progressPercent} className="h-2" />
        </CardContent>
      </Card>
    </Link>
  )
}

import { getHabit, deleteHabit } from '@/lib/habits'
import { getLogsForHabit, checkIn } from '@/lib/habit-logs'
import { calculateStreak } from '@/lib/streaks'
import { CalendarView } from '@/components/habits/calendar-view'
import { notFound, redirect } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, Edit, Trash2, Trophy, Flame, Target, CalendarDays, PartyPopper, Clock, BarChart3, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { format } from 'date-fns'
import { revalidatePath } from 'next/cache'
import { JourneyDiary } from '@/components/habits/journey-diary'

export const dynamic = 'force-dynamic'

const emojiMap: Record<string, string> = {
  blue: '💧',
  green: '🌿',
  purple: '📚',
  orange: '🏋️',
  rose: '🧘',
}

export default async function HabitDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const habit = await getHabit(id)
  
  if (!habit) {
    notFound()
  }

  const logs = await getLogsForHabit(habit.id)
  const { current, longest, completedDays } = calculateStreak(logs)
  const progressPercent = Math.min(Math.round((completedDays / habit.target_days) * 100), 100)
  const daysRemaining = Math.max(habit.target_days - completedDays, 0)
  const isChallengeCompleted = completedDays >= habit.target_days
  
  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const isCompletedToday = logs.some(log => log.date === todayStr && log.completed)

  // Quantity stats for numeric habits
  const isNumeric = habit.type === 'numeric'
  const totalValue = logs.reduce((sum, log) => sum + (log.value || 0), 0)
  const todayLog = logs.find(log => log.date === todayStr)
  const todayValue = todayLog ? todayLog.value : 0
  // Parse unit: format is 'BLOG/tuần' or 'Trang/ngày'
  const rawUnit = habit.unit || ''
  const unitParts = rawUnit.split('/')
  const unitName = unitParts[0]?.trim() || ''
  const frequency = unitParts[1]?.trim() || 'ngày'
  const frequencyLabel = `mỗi ${frequency}`

  const toggleToday = async () => {
    'use server'
    await checkIn(habit.id, todayStr, !isCompletedToday)
    revalidatePath(`/habits/${habit.id}`)
    revalidatePath('/dashboard')
  }

  const deleteAction = async () => {
    'use server'
    const success = await deleteHabit(habit.id)
    if (success) {
      redirect('/dashboard')
    }
  }

  const emoji = emojiMap[habit.color] || '✅'

  return (
    <div className="container px-4 md:px-6 py-8 max-w-5xl mx-auto space-y-8">
      {isChallengeCompleted && (
        <div className="relative overflow-hidden rounded-2xl border border-yellow-500/30 bg-gradient-to-r from-yellow-500/10 via-amber-500/10 to-orange-500/10 p-6 text-center shadow-sm">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(250,204,21,0.1),transparent_70%)]" />
          <div className="relative z-10">
            <PartyPopper className="h-10 w-10 text-yellow-500 mx-auto mb-3" />
            <h2 className="text-2xl font-bold mb-1">🎉 Chúc mừng!</h2>
            <p className="text-muted-foreground">Bạn đã hoàn thành thử thách <strong>{habit.name}</strong>!</p>
          </div>
        </div>
      )}

      {/* Header section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
            <Link href="/dashboard" className="hover:text-foreground flex items-center transition-colors">
              <ArrowLeft className="mr-1 h-3.5 w-3.5" /> Quay lại Tổng quan
            </Link>
          </div>
          
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-center gap-3">
            <span className="text-4xl">{emoji}</span>
            {habit.name}
          </h1>
          {habit.description ? (
            <p className="text-lg text-muted-foreground">{habit.description}</p>
          ) : (
            <p className="text-lg text-muted-foreground">Mục tiêu: {habit.target_days} ngày</p>
          )}
        </div>
        
        <div className="flex flex-wrap items-center gap-3">
          <form action={toggleToday}>
            <Button 
              size="lg"
              variant={isCompletedToday ? "secondary" : "default"} 
              className={`rounded-full px-8 font-semibold shadow-md ${
                isCompletedToday ? "bg-primary/10 text-primary hover:bg-primary/20 shadow-none" : "shadow-primary/25"
              }`}
            >
              {isCompletedToday ? 'Đã điểm danh' : 'Điểm danh hôm nay'}
            </Button>
          </form>
          <Link href={`/habits/${habit.id}/edit`}>
            <Button variant="outline" size="icon" className="rounded-full h-11 w-11 hover:bg-muted/50">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
          <form action={deleteAction}>
            <Button variant="destructive" size="icon" className="rounded-full h-11 w-11 shadow-sm shadow-destructive/20 hover:shadow-md hover:bg-destructive/90">
              <Trash2 className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
        {/* Left Column: Stats */}
        <div className="md:col-span-1 space-y-6">
          <Card className="rounded-2xl border-border/60 shadow-sm">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Tiến độ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-4xl font-extrabold mb-2 text-foreground">
                {completedDays} <span className="text-xl text-muted-foreground font-semibold">/ {habit.target_days}</span>
              </div>
              <Progress value={progressPercent} className="h-2.5 mb-3" />
              <p className="text-sm text-muted-foreground font-medium">Đã hoàn thành {progressPercent}%</p>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-border/60 shadow-sm bg-accent/20">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Thống kê</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {isNumeric && (
                <>
                  <div className="flex justify-between items-center bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl p-3 border border-primary/20">
                    <div className="flex items-center gap-2 text-foreground">
                      <BarChart3 className="h-4 w-4 text-primary" />
                      <span className="text-sm font-semibold">Tổng đã đạt</span>
                    </div>
                    <span className="font-extrabold text-lg text-primary">{totalValue} {unitName}</span>
                  </div>
                  <div className="flex justify-between items-center bg-background rounded-xl p-3 border border-border/50">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <TrendingUp className="h-4 w-4 text-emerald-500" />
                      <span className="text-sm font-medium">Hôm nay</span>
                    </div>
                    <span className="font-bold text-base">{todayValue} / {habit.target_value} {unitName}</span>
                  </div>
                </>
              )}
              <div className="flex justify-between items-center bg-background rounded-xl p-3 border border-border/50">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Flame className="h-4 w-4 text-orange-500" />
                  <span className="text-sm font-medium">Chuỗi hiện tại</span>
                </div>
                <span className="font-bold text-base">{current} ngày</span>
              </div>
              <div className="flex justify-between items-center bg-background rounded-xl p-3 border border-border/50">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Trophy className="h-4 w-4 text-yellow-500" />
                  <span className="text-sm font-medium">Chuỗi dài nhất</span>
                </div>
                <span className="font-bold text-base">{longest} ngày</span>
              </div>
              <div className="flex justify-between items-center bg-background rounded-xl p-3 border border-border/50">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Target className="h-4 w-4 text-primary" />
                  <span className="text-sm font-medium">Mục tiêu</span>
                </div>
                <span className="font-bold text-base">{habit.target_days} ngày{isNumeric ? ` · ${habit.target_value} ${unitName} ${frequencyLabel}` : ''}</span>
              </div>
              <div className="flex justify-between items-center bg-background rounded-xl p-3 border border-border/50">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Clock className="h-4 w-4 text-blue-500" />
                  <span className="text-sm font-medium">Còn lại</span>
                </div>
                <span className="font-bold text-base">{daysRemaining} ngày</span>
              </div>
            </CardContent>
          </Card>
          
          <JourneyDiary habitId={habit.id} initialNote={habit.diary_note || null} />
        </div>

        {/* Right Column: Calendar */}
        <div className="md:col-span-2 space-y-6">
          <Card className="rounded-2xl border-border/60 shadow-sm">
            <CardHeader className="border-b border-border/40 pb-4 mb-4">
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="h-5 w-5 text-primary" />
                Lịch Sử Điểm Danh
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CalendarView logs={logs} />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}

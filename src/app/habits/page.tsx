import { getHabits } from '@/lib/habits'
import { HabitCard } from '@/components/habits/habit-card'
import { getLogsForHabit } from '@/lib/habit-logs'
import { HabitWithLogs } from '@/types/habits'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { PlusCircle, Target, Flame } from 'lucide-react'

export const dynamic = 'force-dynamic'

export default async function HabitsPage() {
  const habits = await getHabits()
  
  const habitsWithLogs: HabitWithLogs[] = await Promise.all(
    habits.map(async (habit) => {
      const logs = await getLogsForHabit(habit.id)
      return { ...habit, logs }
    })
  )

  return (
    <div className="container px-4 md:px-6 py-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight flex items-center gap-3">
            <span className="text-primary"><Flame className="h-8 w-8" /></span>
            Tất cả thử thách
          </h1>
          <p className="text-muted-foreground mt-2 text-base md:text-lg">Xem và quản lý tất cả các thói quen bạn đang thực hiện.</p>
        </div>
        <Link href="/habits/new">
          <Button className="hidden md:flex gap-2 rounded-full px-6 shadow-md shadow-primary/25">
            <PlusCircle className="h-4 w-4" />
            Thử thách mới
          </Button>
        </Link>
      </div>

      {habitsWithLogs.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 border-2 rounded-2xl bg-muted/20 border-dashed text-center">
          <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center mb-6">
            <Target className="h-10 w-10 text-primary" />
          </div>
          <h3 className="text-2xl font-bold mb-3">Chưa có thử thách nào</h3>
          <p className="text-muted-foreground max-w-md mb-8 text-lg">
            Bạn chưa bắt đầu bất kỳ thử thách thói quen nào. Xây dựng thử thách đầu tiên để bắt đầu theo dõi tiến độ của bạn.
          </p>
          <Link href="/habits/new">
            <Button size="lg" className="gap-2 rounded-full px-8 shadow-md shadow-primary/25">
              <PlusCircle className="h-5 w-5" />
              Bắt đầu Thử thách
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {habitsWithLogs.map(habit => (
            <HabitCard key={habit.id} habit={habit} />
          ))}
          
          {/* Add new habit card placeholder */}
          <Link href="/habits/new" className="block h-full">
            <div className="h-full min-h-[220px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-4 text-muted-foreground hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer group">
              <div className="h-14 w-14 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                <PlusCircle className="h-7 w-7 group-hover:text-primary transition-colors" />
              </div>
              <span className="text-base font-semibold group-hover:text-primary transition-colors">Thêm thói quen mới</span>
            </div>
          </Link>
        </div>
      )}
      
      <Link href="/habits/new" className="md:hidden block mt-8">
        <Button size="lg" className="w-full gap-2 rounded-full shadow-md shadow-primary/25">
          <PlusCircle className="h-5 w-5" />
          Bắt đầu Thử thách
        </Button>
      </Link>
    </div>
  )
}

import { getHabits } from '@/lib/habits'
import { HabitCard } from '@/components/habits/habit-card'
import { DailyCheckIn } from '@/components/habits/daily-checkin'
import { getLogsForHabit } from '@/lib/habit-logs'
import { HabitWithLogs } from '@/types/habits'
import { calculateStreak } from '@/lib/streaks'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { PlusCircle, Trophy, Quote } from 'lucide-react'
import { format } from 'date-fns'
import { vi } from 'date-fns/locale'

export const dynamic = 'force-dynamic'

const quotes = [
  { text: "Thành công là tổng hợp của những nỗ lực nhỏ, lặp đi lặp lại ngày qua ngày.", author: "Robert Collier" },
  { text: "Chúng ta là những gì chúng ta lặp đi lặp lại. Vì vậy, sự xuất sắc không phải là một hành động, mà là một thói quen.", author: "Aristotle" },
  { text: "Mỗi ngày mới là một cơ hội để thay đổi cuộc đời bạn.", author: "Khuyết danh" },
  { text: "Kỷ luật là cầu nối giữa mục tiêu và thành tựu.", author: "Jim Rohn" },
  { text: "Sự kiên trì là chìa khóa mở cánh cửa thành công.", author: "Khuyết danh" },
  { text: "Đừng chờ đợi. Thời gian không bao giờ là 'vừa đúng'.", author: "Napoleon Hill" },
  { text: "Cách duy nhất để làm những công việc vĩ đại là yêu những gì bạn làm.", author: "Steve Jobs" },
  { text: "Một ngàn dặm hành trình bắt đầu từ một bước đi.", author: "Lão Tử" },
  { text: "Sự khác biệt giữa những người thành công và những người thất bại không phải là ở sức mạnh, kiến thức hay sự hiểu biết - mà chính là ở ý chí.", author: "Vince Lombardi" },
  { text: "Đừng đo sự thành công bằng những gì bạn đạt được, mà bằng những trở ngại bạn đã vượt qua.", author: "Booker T. Washington" },
  { text: "Bạn không thể thay đổi điểm bắt đầu, nhưng bạn có thể bắt đầu ngay từ bây giờ và thay đổi điểm kết thúc.", author: "C.S. Lewis" },
  { text: "Mọi thứ dường như luôn là không thể cho đến khi nó được hoàn thành.", author: "Nelson Mandela" },
  { text: "Năng lực của bạn sẽ phát triển khi bạn đối mặt với những thử thách vượt quá khả năng hiện tại.", author: "Khuyết danh" },
  { text: "Chất lượng cuộc sống của bạn được quyết định bởi chất lượng của những câu hỏi bạn tự đặt ra cho chính mình.", author: "Tony Robbins" },
  { text: "Bạn không cần phải vĩ đại để bắt đầu, nhưng bạn phải bắt đầu để trở nên vĩ đại.", author: "Zig Ziglar" },
  { text: "Người duy nhất bạn nên cố gắng để giỏi hơn chính là bạn của ngày hôm qua.", author: "Khuyết danh" },
  { text: "Những điều tốt đẹp đến với những ai biết chờ đợi. Những điều lớn lao đến với những người nhấc mông lên và tự mình làm mọi thứ.", author: "Khuyết danh" },
  { text: "Tôi học được rằng lòng can đảm không phải là không có sự sợ hãi, mà là sự chiến thắng nó.", author: "Nelson Mandela" },
  { text: "Nếu bạn không xây dựng ước mơ của mình, người khác sẽ thuê bạn để xây dựng ước mơ của họ.", author: "Tony Gaskins" },
  { text: "Chẳng có gì là quá muộn để trở thành người mà bạn muốn trở thành.", author: "George Eliot" },
  { text: "Dù bạn nghĩ rằng bạn có thể hay không thể, bạn đều đúng.", author: "Henry Ford" }
]

function getGreeting(): string {
  // Use Vietnam timezone (UTC+7)
  const vnTime = new Date().toLocaleString('en-US', { timeZone: 'Asia/Ho_Chi_Minh', hour: 'numeric', hour12: false })
  const hour = parseInt(vnTime, 10)
  if (hour < 12) return 'Chào buổi sáng'
  if (hour < 18) return 'Chào buổi chiều'
  return 'Chào buổi tối'
}

export default async function DashboardPage() {
  const habits = await getHabits()
  
  const habitsWithLogs: HabitWithLogs[] = await Promise.all(
    habits.map(async (habit) => {
      const logs = await getLogsForHabit(habit.id)
      return { ...habit, logs }
    })
  )

  const todayStr = format(new Date(), 'yyyy-MM-dd')
  const completedToday = habitsWithLogs.filter(h => 
    h.logs.some(log => log.date === todayStr && log.completed)
  ).length
  const totalHabits = habitsWithLogs.length
  const completionPercent = totalHabits > 0 ? Math.round((completedToday / totalHabits) * 100) : 0

  // Best streak and completed challenges
  let bestCurrentStreak = 0
  let bestStreakHabit = ''
  habitsWithLogs.forEach(h => {
    const { current } = calculateStreak(h.logs)
    if (current > bestCurrentStreak) {
      bestCurrentStreak = current
      bestStreakHabit = h.name
    }
  })

  // Random motivational quote (based on day)
  const quoteIndex = new Date().getDate() % quotes.length
  const todayQuote = quotes[quoteIndex]

  // Circumference for circular progress (radius = 45)
  const circumference = 2 * Math.PI * 45
  const strokeOffset = circumference - (completionPercent / 100) * circumference

  return (
    <div className="container px-4 md:px-6 py-8 max-w-7xl mx-auto">
      {/* Greeting + Circular Progress */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
        <div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            {getGreeting()}! 👋
          </h1>
          <p className="text-muted-foreground mt-2 text-base md:text-lg">
            Hôm nay là một ngày tuyệt vời để hoàn thành mục tiêu của bạn.
          </p>
        </div>
        
        {totalHabits > 0 && (
          <div className="flex items-center gap-4 bg-primary/5 border border-primary/15 rounded-2xl px-6 py-4">
            {/* SVG Circular Progress */}
            <div className="relative w-16 h-16 flex-shrink-0">
              <svg className="w-16 h-16" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="45" fill="none" stroke="currentColor" strokeWidth="8" className="text-primary/10" />
                <circle 
                  cx="50" cy="50" r="45" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="8" 
                  strokeLinecap="round"
                  className="text-primary progress-ring-circle"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeOffset}
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-sm font-bold text-primary">{completionPercent}%</span>
              </div>
            </div>
            <div>
              <p className="text-xs font-semibold uppercase tracking-wider text-primary">Tiến độ hôm nay</p>
              <p className="text-2xl font-bold">{completedToday}<span className="text-muted-foreground text-lg font-normal"> / {totalHabits}</span></p>
              <p className="text-xs text-muted-foreground">Thói quen đã hoàn thành</p>
            </div>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Mobile-first: Achievement + Check-in shown first on mobile */}
        <div className="lg:hidden space-y-6">
          {/* Achievement Card */}
          {bestCurrentStreak > 0 && (
            <Card className="bg-gradient-to-br from-primary to-amber-600 text-primary-foreground border-0 shadow-lg shadow-primary/20 overflow-hidden">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-3">Thành tích mới</h3>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Kỷ lục mới!</p>
                    <p className="font-bold text-lg">{bestCurrentStreak} ngày liên tiếp {bestStreakHabit}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Daily Check-in */}
          <div>
            <h2 className="text-lg font-bold tracking-tight mb-4">Điểm danh hôm nay</h2>
            <DailyCheckIn habits={habitsWithLogs} />
          </div>
        </div>

        {/* Left: Habits */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold tracking-tight flex items-center gap-2">
              ⚡ Thói quen đang thực hiện
            </h2>
            <Link href="/habits" className="text-sm font-medium text-primary hover:underline underline-offset-4">
              Xem tất cả →
            </Link>
          </div>

          {habitsWithLogs.length === 0 ? (
            <div className="text-center p-12 border-2 border-dashed rounded-2xl bg-muted/20">
              <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                <PlusCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2">Chưa có thói quen nào</h3>
              <p className="text-muted-foreground mb-6 max-w-sm mx-auto">Bắt đầu một thử thách thói quen mới để theo dõi tại đây.</p>
              <Link href="/habits/new">
                <Button className="rounded-full px-6 shadow-md shadow-primary/25">Tạo thử thách đầu tiên</Button>
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {habitsWithLogs.map(habit => (
                <HabitCard key={habit.id} habit={habit} />
              ))}
              {/* Add new habit card */}
              <Link href="/habits/new" className="block">
                <div className="h-full min-h-[180px] border-2 border-dashed rounded-2xl flex flex-col items-center justify-center gap-3 text-muted-foreground hover:border-primary/40 hover:bg-primary/5 transition-all cursor-pointer group">
                  <div className="h-12 w-12 rounded-full bg-muted/50 flex items-center justify-center group-hover:bg-primary/10 transition-colors">
                    <PlusCircle className="h-6 w-6 group-hover:text-primary transition-colors" />
                  </div>
                  <span className="text-sm font-medium group-hover:text-primary transition-colors">Thêm thói quen mới</span>
                </div>
              </Link>
            </div>
          )}
        </div>

        {/* Right Sidebar (desktop only for achievement + check-in, always for quote) */}
        <div className="space-y-6">
          {/* Achievement Card - desktop only */}
          {bestCurrentStreak > 0 && (
            <Card className="hidden lg:block bg-gradient-to-br from-primary to-amber-600 text-primary-foreground border-0 shadow-lg shadow-primary/20 overflow-hidden">
              <CardContent className="p-6">
                <h3 className="font-bold text-lg mb-3">Thành tích mới</h3>
                <div className="flex items-center gap-3">
                  <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                    <Trophy className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm opacity-90">Kỷ lục mới!</p>
                    <p className="font-bold text-lg">{bestCurrentStreak} ngày liên tiếp {bestStreakHabit}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Daily Check-in - desktop only */}
          <div className="hidden lg:block">
            <h2 className="text-lg font-bold tracking-tight mb-4">Điểm danh hôm nay</h2>
            <DailyCheckIn habits={habitsWithLogs} />
          </div>

          {/* Motivational Quote */}
          <Card className="bg-accent/30 border-primary/10 overflow-hidden relative">
            <CardContent className="p-6">
              <Quote className="h-8 w-8 text-primary/20 absolute top-4 right-4" />
              <p className="text-sm italic text-foreground/80 leading-relaxed mb-3">
                &ldquo;{todayQuote.text}&rdquo;
              </p>
              <p className="text-xs font-semibold text-muted-foreground">— {todayQuote.author}</p>
            </CardContent>
          </Card>

          {/* Mobile: Add habit button */}
          <Link href="/habits/new" className="lg:hidden block">
            <Button className="w-full gap-2 rounded-full shadow-md shadow-primary/25">
              <PlusCircle className="h-4 w-4" />
              Thử thách mới
            </Button>
          </Link>
        </div>
      </div>
    </div>
  )
}

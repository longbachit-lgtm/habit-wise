import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import Link from 'next/link'
import { ArrowRight, CheckCircle2, Target, CalendarDays, Zap, Flame } from 'lucide-react'

export default async function Home() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (user) {
    redirect('/dashboard')
  }

  return (
    <div className="flex flex-col flex-1">
      {/* Hero Section */}
      <section className="w-full relative overflow-hidden py-12 md:py-24 lg:py-32 xl:py-48 flex-1 flex flex-col justify-center items-center">
        {/* Background Decorative Gradients — Orange theme */}
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 rounded-full mix-blend-multiply filter blur-3xl opacity-60 animate-pulse"></div>
        <div className="absolute top-[20%] right-[-10%] w-96 h-96 bg-orange-300/20 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute bottom-[-20%] left-[20%] w-96 h-96 bg-amber-200/30 rounded-full mix-blend-multiply filter blur-3xl opacity-50 animate-pulse" style={{ animationDelay: '4s' }}></div>

        <div className="container mx-auto px-4 md:px-6 relative z-10">
          <div className="flex flex-col items-center space-y-4 text-center">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary mb-4 gap-2">
              <Flame className="h-4 w-4" />
              <span>Xây dựng thói quen tích cực mỗi ngày</span>
            </div>
            <div className="space-y-4 max-w-3xl">
              <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
                Xây dựng thói quen tốt,<br /> <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-amber-400">Thay đổi cuộc đời</span>
              </h1>
              <p className="mx-auto max-w-[700px] text-muted-foreground md:text-xl font-medium">
                Đặt ra thử thách mỗi ngày. Theo dõi tiến độ. Trở thành phiên bản hoàn thiện nhất của chính bạn.
              </p>
            </div>
            <div className="space-x-4 pt-8">
              <Link href="/login">
                <Button className="h-14 px-8 text-lg font-semibold rounded-full shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 transition-all hover:-translate-y-1 inline-flex items-center gap-2">
                  Bắt đầu ngay <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="w-full py-16 md:py-24 bg-white/50 backdrop-blur-sm border-t">
        <div className="container mx-auto px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">Trải nghiệm theo dõi thói quen tuyệt vời</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="flex flex-col items-center text-center space-y-4 p-8 bg-background rounded-2xl shadow-sm border border-border/50 hover:shadow-md hover:border-primary/20 transition-all duration-300">
              <div className="h-16 w-16 rounded-2xl bg-primary/10 flex items-center justify-center">
                <Target className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold">Đặt Thử Thách</h3>
              <p className="text-muted-foreground">Tạo các thử thách 30, 60 hoặc 90 ngày để hình thành những thói quen tích cực mới.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-8 bg-background rounded-2xl shadow-sm border border-border/50 hover:shadow-md hover:border-primary/20 transition-all duration-300">
              <div className="h-16 w-16 rounded-2xl bg-orange-100 flex items-center justify-center">
                <CheckCircle2 className="h-8 w-8 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold">Check-in Mỗi Ngày</h3>
              <p className="text-muted-foreground">Hệ thống check-in một chạm đơn giản, nhanh chóng mọi lúc mọi nơi.</p>
            </div>
            <div className="flex flex-col items-center text-center space-y-4 p-8 bg-background rounded-2xl shadow-sm border border-border/50 hover:shadow-md hover:border-primary/20 transition-all duration-300">
              <div className="h-16 w-16 rounded-2xl bg-amber-100 flex items-center justify-center">
                <CalendarDays className="h-8 w-8 text-amber-600" />
              </div>
              <h3 className="text-xl font-bold">Giữ Lửa Đam Mê</h3>
              <p className="text-muted-foreground">Trực quan hóa sự kiên trì của bạn với dạng xem lịch và chuỗi duy trì.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}

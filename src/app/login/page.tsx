import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Flame } from 'lucide-react'

export default async function LoginPage({ searchParams }: { searchParams: Promise<{ message?: string }> }) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  const { message } = await searchParams

  // If user is already logged in, redirect to dashboard
  if (user) {
    redirect('/dashboard')
  }

  const signIn = async (formData: FormData) => {
    'use server'

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = await createClient()

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) {
      return redirect('/login?message=Could not authenticate user')
    }

    return redirect('/dashboard')
  }

  const signUp = async (formData: FormData) => {
    'use server'

    const email = formData.get('email') as string
    const password = formData.get('password') as string
    const supabase = await createClient()

    const { error } = await supabase.auth.signUp({
      email,
      password,
    })

    if (error) {
      return redirect('/login?message=Could not authenticate user')
    }

    return redirect('/dashboard')
  }

  return (
    <div className="flex h-[calc(100vh-4rem)] items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute top-[-10%] right-[-5%] w-96 h-96 bg-primary/10 rounded-full mix-blend-multiply blur-3xl opacity-70"></div>
      <div className="absolute bottom-[-10%] left-[-5%] w-[500px] h-[500px] bg-orange-300/10 rounded-full mix-blend-multiply blur-3xl opacity-50"></div>

      <Card className="w-full max-w-sm rounded-[2rem] border-white/20 shadow-xl shadow-primary/5 bg-white/60 backdrop-blur-xl relative z-10">
        <CardHeader className="text-center pt-8 pb-4">
          <div className="mx-auto bg-primary w-12 h-12 rounded-full flex items-center justify-center mb-4 shadow-lg shadow-primary/30">
            <Flame className="w-6 h-6 text-primary-foreground" />
          </div>
          <CardTitle className="text-2xl font-extrabold tracking-tight">Chào mừng trở lại</CardTitle>
          <CardDescription className="text-base mt-2">
            Đăng nhập hoặc tạo mới để quản lý thói quen
          </CardDescription>
        </CardHeader>
        <div className="px-8 pb-8 pt-2">
          <form className="grid gap-5">
            {message && (
              <div className="p-3 bg-red-500/10 text-red-600 font-medium text-sm rounded-xl text-center border border-red-500/20">
                {message === 'Could not authenticate user' ? 'Thông tin đăng nhập không chính xác hoặc có lỗi xảy ra.' : message}
              </div>
            )}
            <div className="grid gap-2">
              <Label htmlFor="email" className="font-semibold text-foreground/80">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="m@example.com"
                className="h-12 rounded-xl bg-white focus-visible:ring-primary/40 border-border/50 shadow-sm"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password" className="font-semibold text-foreground/80">Mật khẩu</Label>
              </div>
              <Input 
                id="password" 
                name="password" 
                type="password" 
                className="h-12 rounded-xl bg-white focus-visible:ring-primary/40 border-border/50 shadow-sm"
                required 
              />
            </div>
            <div className="flex flex-col gap-3 mt-4">
              <Button formAction={signIn} type="submit" className="w-full h-12 rounded-full font-bold shadow-md shadow-primary/20 text-md">
                Đăng nhập
              </Button>
              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border/50" />
                </div>
                <div className="relative flex justify-center text-xs uppercase">
                  <span className="bg-transparent px-2 text-muted-foreground font-medium">Hoặc</span>
                </div>
              </div>
              <Button formAction={signUp} variant="outline" type="submit" className="w-full h-12 rounded-full font-bold border-2 border-primary/20 text-primary hover:bg-primary/5 hover:text-primary transition-colors text-md">
                Tạo tài khoản mới
              </Button>
            </div>
          </form>
        </div>
      </Card>
    </div>
  )
}

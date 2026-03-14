'use client'

import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { LayoutDashboard, CheckCircle, Trophy, LogOut, Flame } from 'lucide-react'

interface NavbarClientProps {
  isLoggedIn: boolean
}

function NavbarClient({ isLoggedIn }: NavbarClientProps) {
  const pathname = usePathname()

  const navItems = [
    { href: '/dashboard', label: 'Tổng quan', icon: LayoutDashboard },
    { href: '/habits', label: 'Thói quen', icon: CheckCircle },
  ]

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-lg">
      <div className="container flex h-16 items-center justify-between px-4 md:px-6">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="h-9 w-9 rounded-full bg-primary flex items-center justify-center">
            <Flame className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="font-bold text-lg">Routine</span>
        </Link>
        
        <div className="flex flex-1 items-center justify-end space-x-2">
          {isLoggedIn ? (
            <nav className="flex items-center gap-1">
              {navItems.map((item) => {
                const isActive = pathname === item.href || pathname?.startsWith(item.href + '/')
                const Icon = item.icon
                return (
                  <Link key={item.href} href={item.href}>
                    <Button
                      variant={isActive ? "default" : "ghost"}
                      size="sm"
                      className={`gap-2 rounded-full px-4 h-9 font-medium transition-all ${
                        isActive 
                          ? 'bg-primary text-primary-foreground shadow-md shadow-primary/25' 
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted'
                      }`}
                    >
                      <Icon className="h-4 w-4" />
                      <span className="hidden sm:inline">{item.label}</span>
                    </Button>
                  </Link>
                )
              })}
              <div className="ml-2 h-6 w-px bg-border" />
              <form action="/auth/signout" method="post">
                <Button variant="ghost" size="sm" className="gap-2 rounded-full h-9 text-muted-foreground hover:text-destructive">
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Đăng xuất</span>
                </Button>
              </form>
            </nav>
          ) : (
            <nav className="flex items-center gap-2">
              <Link href="/login">
                <Button variant="ghost" size="sm" className="rounded-full">Đăng nhập</Button>
              </Link>
              <Link href="/login">
                <Button size="sm" className="rounded-full shadow-md shadow-primary/25">Đăng ký</Button>
              </Link>
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}

export { NavbarClient }

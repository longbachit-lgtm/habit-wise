export default function NewHabitPage() {
  return (
    <div className="container px-4 md:px-6 py-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Tạo Thử Thách Mới</h1>
        <p className="text-muted-foreground mt-1">Xác định thói quen mới của bạn và đặt mục tiêu.</p>
      </div>
      
      <HabitForm />
    </div>
  )
}

import { HabitForm } from '@/components/habits/habit-form'

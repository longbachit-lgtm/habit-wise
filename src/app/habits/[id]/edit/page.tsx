import { getHabit } from '@/lib/habits'
import { HabitForm } from '@/components/habits/habit-form'
import { notFound } from 'next/navigation'

export const metadata = {
  title: 'Sửa Thử Thách | Routine',
  description: 'Chỉnh sửa thông tin thử thách của bạn'
}

export default async function EditHabitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const habit = await getHabit(id)

  if (!habit) {
    notFound()
  }

  return (
    <div className="container px-4 md:px-6 py-8 max-w-4xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Sửa Thử Thách</h1>
        <p className="text-muted-foreground mt-1">Cập nhật thông tin và mục tiêu thói quen của bạn.</p>
      </div>
      
      <HabitForm initialData={habit} />
    </div>
  )
}

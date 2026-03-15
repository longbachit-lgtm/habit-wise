'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { createHabit, updateHabit } from '@/lib/habits'
import { Habit, HabitType } from '@/types/habits'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { toast } from 'sonner'
import { Loader2, Flame } from 'lucide-react'

const emojiMap: Record<string, string> = {
  blue: '💧',
  green: '🌿',
  purple: '📚',
  orange: '🏋️',
  rose: '🧘',
}

interface HabitFormProps {
  initialData?: Habit;
}

export function HabitForm({ initialData }: HabitFormProps) {
  const router = useRouter()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const isEditing = !!initialData
  
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    
    const formData = new FormData(e.currentTarget)
    
    const targetValueStr = formData.get('target_value') as string
    const targetValue = targetValueStr ? parseInt(targetValueStr, 10) : 1
    const habitType = formData.get('type') as HabitType
    
    const payload: Record<string, unknown> = {
      name: formData.get('name') as string,
      description: formData.get('description') as string,
      target_days: parseInt(formData.get('target_days') as string, 10),
      type: habitType,
      color: formData.get('color') as string || 'blue',
      icon: initialData?.icon || 'CheckCircle',
    }

    // Only include numeric fields when type is numeric
    if (habitType === 'numeric') {
      payload.target_value = targetValue
      payload.unit = formData.get('unit') as string || ''
    }

    try {
      if (isEditing && initialData) {
        const updatedHabit = await updateHabit(initialData.id, payload as any)
        if (updatedHabit) {
          toast.success('Cập nhật thử thách thành công!')
          router.push('/dashboard')
          router.refresh()
        } else {
          toast.error('Lỗi khi cập nhật thử thách.')
        }
      } else {
        const newHabit = await createHabit(payload as any)
        if (newHabit) {
          toast.success('Tạo thử thách thành công!')
          router.push('/dashboard')
          router.refresh()
        } else {
          toast.error('Lỗi khi tạo thử thách.')
        }
      }
    } catch (error) {
      toast.error('Đã xảy ra lỗi không mong muốn.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Card className="w-full max-w-2xl mx-auto rounded-3xl border-border/50 shadow-sm mt-8">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mb-4">
          <Flame className="w-8 h-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">{isEditing ? 'Sửa Thử Thách' : 'Tạo Thử Thách Mới'}</CardTitle>
        <p className="text-muted-foreground mt-2">Thiết lập mục tiêu và bắt đầu hành trình của bạn.</p>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-6 pt-6">
          <div className="space-y-3">
            <Label htmlFor="name" className="text-sm font-semibold">Tên Thói Quen <span className="text-destructive">*</span></Label>
            <Input 
              id="name" 
              name="name" 
              placeholder="VD: 30 ngày thiền định"
              defaultValue={initialData?.name || ''}
              className="h-12 rounded-xl bg-muted/20 border-border/60 focus-visible:ring-primary/30"
              required 
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-3">
              <Label htmlFor="target_days" className="text-sm font-semibold">Mục Tiêu (Ngày) <span className="text-destructive">*</span></Label>
              <Input 
                id="target_days" 
                name="target_days" 
                type="number" 
                min="1" 
                max="365"
                defaultValue={initialData?.target_days || "30"}
                className="h-12 rounded-xl bg-muted/20 border-border/60 focus-visible:ring-primary/30"
                required 
              />
            </div>

            <div className="space-y-3">
              <Label htmlFor="color" className="text-sm font-semibold">Biểu Tượng & Màu Sắc</Label>
              <Select name="color" defaultValue={initialData?.color || "green"}>
                <SelectTrigger className="h-12 rounded-xl bg-muted/20 border-border/60 focus:ring-primary/30">
                  <SelectValue placeholder="Chọn màu và biểu tượng" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  {Object.entries(emojiMap).map(([colorKey, emoji]) => (
                    <SelectItem key={colorKey} value={colorKey} className="rounded-lg">
                      <div className="flex items-center gap-2">
                        <span className="text-xl">{emoji}</span>
                        <span className="capitalize">{colorKey === 'blue' ? 'Nước (Xanh dương)' : colorKey === 'green' ? 'Tinh thần (Xanh lá)' : colorKey === 'purple' ? 'Học tập (Tím)' : colorKey === 'orange' ? 'Thể chất (Cam)' : 'Thư giãn (Hồng)'}</span>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-3 md:col-span-2">
              <Label htmlFor="type" className="text-sm font-semibold">Loại Thói Quen</Label>
              <Select 
                name="type" 
                defaultValue={initialData?.type || "checkbox"}
                onValueChange={(val) => {
                  const el = document.getElementById("numeric-inputs")
                  if (el) el.style.display = val === "numeric" ? "grid" : "none"
                }}
              >
                <SelectTrigger className="h-12 rounded-xl bg-muted/20 border-border/60 focus:ring-primary/30">
                  <SelectValue placeholder="Chọn loại thói quen" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="checkbox" className="rounded-lg">Theo dõi điểm danh (Hoàn thành / Chưa hoàn thành)</SelectItem>
                  <SelectItem value="numeric" className="rounded-lg">Theo dõi số lượng (VD: Đọc 50 trang sách, Chạy 5km)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div id="numeric-inputs" className="md:col-span-2 grid-cols-1 md:grid-cols-2 gap-6" style={{ display: initialData?.type === "numeric" ? "grid" : "none" }}>
              <div className="space-y-3">
                <Label htmlFor="target_value" className="text-sm font-semibold">Số lượng mục tiêu mỗi ngày <span className="text-destructive">*</span></Label>
                <Input 
                  id="target_value" 
                  name="target_value" 
                  type="number" 
                  min="1" 
                  defaultValue={initialData?.target_value || 1}
                  className="h-12 rounded-xl bg-muted/20 border-border/60 focus-visible:ring-primary/30"
                />
              </div>
              <div className="space-y-3">
                <Label htmlFor="unit" className="text-sm font-semibold">Đơn vị (VD: Trang, km, Phút) <span className="text-destructive">*</span></Label>
                <Input 
                  id="unit" 
                  name="unit" 
                  type="text" 
                  defaultValue={initialData?.unit || ""}
                  placeholder="VD: Trang, km, Lít"
                  className="h-12 rounded-xl bg-muted/20 border-border/60 focus-visible:ring-primary/30"
                />
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <Label htmlFor="description" className="text-sm font-semibold">Mô Tả Mục Tiêu (Tùy chọn)</Label>
            <Textarea 
              id="description" 
              name="description" 
              placeholder="Tại sao bạn muốn bắt đầu thử thách này? Động lực của bạn là gì?"
              defaultValue={initialData?.description || ''}
              className="min-h-[100px] rounded-xl bg-muted/20 border-border/60 focus-visible:ring-primary/30 resize-none"
            />
          </div>
        </CardContent>
        
        <CardFooter className="flex flex-col sm:flex-row justify-end gap-3 pt-4 pb-8 border-t border-border/40 mt-6 px-6">
          <Button 
            type="button" 
            variant="ghost"
            onClick={() => router.back()}
            disabled={isSubmitting}
            className="w-full sm:w-auto rounded-full font-semibold text-muted-foreground hover:text-foreground h-12 px-8"
          >
            Hủy
          </Button>
          <Button 
            type="submit" 
            disabled={isSubmitting}
            className="w-full sm:w-auto rounded-full font-bold shadow-md shadow-primary/20 h-12 px-8"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                Đang lưu...
              </>
            ) : (
              isEditing ? 'Cập Nhật Thử Thách' : 'Bắt Đầu Ngay'
            )}
          </Button>
        </CardFooter>
      </form>
    </Card>
  )
}

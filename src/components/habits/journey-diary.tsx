'use client'

import { useState, useRef, useEffect } from 'react'
import { updateHabit } from '@/lib/habits'
import { Button } from '@/components/ui/button'
import { BookOpen, Loader2, Pencil } from 'lucide-react'
import { toast } from 'sonner'

export function JourneyDiary({ habitId, initialNote }: { habitId: string, initialNote: string | null }) {
  const [note, setNote] = useState(initialNote || '')
  const [savedNote, setSavedNote] = useState(initialNote || '')
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  // Auto-focus and auto-resize textarea when entering edit mode
  useEffect(() => {
    if (isEditing && textareaRef.current) {
      const ta = textareaRef.current
      ta.focus()
      ta.setSelectionRange(ta.value.length, ta.value.length)
      ta.style.height = 'auto'
      ta.style.height = `${Math.max(ta.scrollHeight, 160)}px`
    }
  }, [isEditing])

  const handleSave = async () => {
    setIsSaving(true)
    try {
      await updateHabit(habitId, { diary_note: note })
      setSavedNote(note)
      setIsEditing(false)
      toast.success('Đã lưu nhật ký hành trình!')
    } catch (error) {
      console.error('Failed to save note:', error)
      toast.error('Lỗi khi lưu nhật ký.')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    setNote(savedNote)
    setIsEditing(false)
  }

  const handleTextareaInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setNote(e.target.value)
    // Auto-resize
    const ta = e.target
    ta.style.height = 'auto'
    ta.style.height = `${Math.max(ta.scrollHeight, 160)}px`
  }

  const isEmpty = !savedNote || savedNote.trim() === ''

  return (
    <div className="rounded-2xl border border-border/60 shadow-sm overflow-hidden bg-card">
      {/* Header */}
      <div className="flex items-center gap-2 px-5 py-3.5 border-b border-border/40 bg-muted/30">
        <BookOpen className="h-4 w-4 text-primary" />
        <h3 className="text-sm font-semibold text-foreground">Nhật Ký Hành Trình</h3>
      </div>

      {/* Content area */}
      <div className="px-5 py-4">
        {isEditing ? (
          /* ── EDIT MODE (Trello-like) ── */
          <div>
            <textarea
              ref={textareaRef}
              value={note}
              onChange={handleTextareaInput}
              placeholder="Mẹo chuyên nghiệp: Nhấn 'Enter' để xuống dòng và 'Shift + Enter' để ngắt dòng đơn giản."
              className="w-full min-h-[160px] p-3 rounded-lg border-2 border-primary/40 bg-background text-sm leading-relaxed resize-none outline-none focus:border-primary/60 transition-colors placeholder:text-muted-foreground/50"
              onKeyDown={(e) => {
                // Ctrl+Enter or Cmd+Enter to save
                if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
                  e.preventDefault()
                  handleSave()
                }
                // Escape to cancel
                if (e.key === 'Escape') {
                  handleCancel()
                }
              }}
            />
            <div className="flex items-center gap-2 mt-3">
              <Button
                size="sm"
                onClick={handleSave}
                disabled={isSaving}
                className="h-8 px-4 rounded-md font-semibold text-xs shadow-sm"
              >
                {isSaving ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                    Đang lưu...
                  </>
                ) : (
                  'Lưu'
                )}
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={handleCancel}
                disabled={isSaving}
                className="h-8 px-3 rounded-md text-xs text-muted-foreground hover:text-foreground font-medium"
              >
                Hủy
              </Button>
              <span className="text-[10px] text-muted-foreground ml-auto hidden sm:inline">
                Ctrl + Enter để lưu · Esc để hủy
              </span>
            </div>
          </div>
        ) : (
          /* ── DISPLAY MODE (Trello-like) ── */
          <div
            onClick={() => setIsEditing(true)}
            className="group cursor-pointer rounded-lg transition-colors hover:bg-muted/40 min-h-[80px] p-3 -m-3"
          >
            {isEmpty ? (
              <div className="flex flex-col items-center justify-center text-center py-6 gap-2">
                <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                  <Pencil className="h-4.5 w-4.5 text-primary/60 group-hover:text-primary transition-colors" />
                </div>
                <p className="text-sm text-muted-foreground group-hover:text-foreground transition-colors font-medium">
                  Nhấn để viết nhật ký hành trình của bạn...
                </p>
                <p className="text-[11px] text-muted-foreground/60">
                  Ghi lại cảm nghĩ, khó khăn, hay bài học trên hành trình này
                </p>
              </div>
            ) : (
              <div className="relative">
                <div className="text-sm text-foreground/85 leading-relaxed whitespace-pre-wrap break-words">
                  {savedNote}
                </div>
                <div className="absolute top-0 right-0 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="bg-muted rounded-md p-1.5 shadow-sm border border-border/40">
                    <Pencil className="h-3.5 w-3.5 text-muted-foreground" />
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

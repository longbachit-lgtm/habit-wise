export type HabitType = 'checkbox' | 'numeric' | 'time'

export interface Habit {
    id: string
    user_id: string
    name: string
    description: string | null
    type: HabitType
    target_days: number
    icon: string
    color: string
    created_at: string
}

export interface HabitLog {
    id: string
    habit_id: string
    date: string // YYYY-MM-DD
    value: number
    completed: boolean
    created_at: string
}

export type HabitWithLogs = Habit & {
    logs: HabitLog[]
}

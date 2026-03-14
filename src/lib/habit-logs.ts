'use server'

import { createClient } from './supabase/server'
import { HabitLog } from '@/types/habits'

export async function checkIn(habitId: string, dateStr: string, completed: boolean, value: number = 0): Promise<boolean> {
    const supabase = await createClient()

    // Upsert the log for this date and habit
    const { error } = await supabase
        .from('habit_logs')
        .upsert(
            {
                habit_id: habitId,
                date: dateStr,
                completed,
                value
            },
            { onConflict: 'habit_id,date' }
        )

    if (error) {
        console.error(`Error checking in habit ${habitId} for date ${dateStr}:`, error)
        return false
    }

    return true
}

export async function getLogsForHabit(habitId: string): Promise<HabitLog[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('habit_logs')
        .select('*')
        .eq('habit_id', habitId)
        .order('date', { ascending: false })

    if (error) {
        console.error(`Error fetching logs for habit ${habitId}:`, error)
        return []
    }

    return data as HabitLog[]
}

// Get all logs for a specific day, used on the dashboard
export async function getLogsForDate(dateStr: string): Promise<HabitLog[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('habit_logs')
        .select('*')
        .eq('date', dateStr)

    if (error) {
        console.error(`Error fetching logs for date ${dateStr}:`, error)
        return []
    }

    return data as HabitLog[]
}

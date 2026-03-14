'use server'

import { createClient } from './supabase/server'
import { Habit, HabitType } from '@/types/habits'

export async function getHabits(): Promise<Habit[]> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('habits')
        .select('*')
        .order('created_at', { ascending: false })

    if (error) {
        console.error('Error fetching habits:', error)
        return []
    }

    return data as Habit[]
}

export async function getHabit(id: string): Promise<Habit | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('habits')
        .select('*')
        .eq('id', id)
        .single()

    if (error) {
        console.error(`Error fetching habit ${id}:`, error)
        return null
    }

    return data as Habit
}

export type CreateHabitPayload = Omit<Habit, 'id' | 'user_id' | 'created_at'>

export async function createHabit(payload: CreateHabitPayload): Promise<Habit | null> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    const { data, error } = await supabase
        .from('habits')
        .insert([
            {
                ...payload,
                user_id: user.id
            }
        ])
        .select()
        .single()

    if (error) {
        console.error('Error creating habit:', error)
        return null
    }

    return data as Habit
}

export type UpdateHabitPayload = Partial<CreateHabitPayload>

export async function updateHabit(id: string, payload: UpdateHabitPayload): Promise<Habit | null> {
    const supabase = await createClient()

    const { data, error } = await supabase
        .from('habits')
        .update(payload)
        .eq('id', id)
        .select()
        .single()

    if (error) {
        console.error(`Error updating habit ${id}:`, error)
        return null
    }

    return data as Habit
}

export async function deleteHabit(id: string): Promise<boolean> {
    const supabase = await createClient()

    const { error } = await supabase
        .from('habits')
        .delete()
        .eq('id', id)

    if (error) {
        console.error(`Error deleting habit ${id}:`, error)
        return false
    }

    return true
}

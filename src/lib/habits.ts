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

export interface CreateHabitPayload {
    name: string
    description: string
    target_days: number
    type: HabitType
    color: string
    icon: string
    diary_note?: string | null
    target_value?: number
    unit?: string | null
}

export async function createHabit(payload: CreateHabitPayload): Promise<Habit | null> {
    const supabase = await createClient()

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return null

    // Only send fields that have values to avoid schema cache errors
    const insertData: Record<string, unknown> = {
        name: payload.name,
        description: payload.description,
        target_days: payload.target_days,
        type: payload.type,
        color: payload.color,
        icon: payload.icon,
        user_id: user.id
    }
    if (payload.diary_note !== undefined) insertData.diary_note = payload.diary_note
    if (payload.target_value !== undefined) insertData.target_value = payload.target_value
    if (payload.unit !== undefined) insertData.unit = payload.unit

    const { data, error } = await supabase
        .from('habits')
        .insert([insertData])
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

    // Filter out undefined values to avoid sending non-existent columns
    const updateData: Record<string, unknown> = {}
    for (const [key, value] of Object.entries(payload)) {
        if (value !== undefined) {
            updateData[key] = value
        }
    }

    const { data, error } = await supabase
        .from('habits')
        .update(updateData)
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

import { isToday, isYesterday, parseISO, differenceInDays } from 'date-fns'
import { HabitLog } from '@/types/habits'

export function calculateStreak(logs: HabitLog[]): { current: number; longest: number; completedDays: number } {
    if (!logs || logs.length === 0) {
        return { current: 0, longest: 0, completedDays: 0 }
    }

    // Sort logs by date descending (newest first)
    const sortedLogs = [...logs].sort((a, b) =>
        new Date(b.date).getTime() - new Date(a.date).getTime()
    )

    // Filter only completed logs
    const completedLogs = sortedLogs.filter(log => log.completed)

    if (completedLogs.length === 0) {
        return { current: 0, longest: 0, completedDays: 0 }
    }

    let currentStreak = 0
    let longestStreak = 0
    let tempStreak = 0
    let previousDate: Date | null = null

    // Calculate longest streak
    for (let i = completedLogs.length - 1; i >= 0; i--) {
        const logDate = parseISO(completedLogs[i].date)

        if (!previousDate) {
            tempStreak = 1
        } else {
            const diff = differenceInDays(logDate, previousDate)
            if (diff === 1) {
                tempStreak++
            } else if (diff > 1) {
                tempStreak = 1
            }
        }

        if (tempStreak > longestStreak) {
            longestStreak = tempStreak
        }
        previousDate = logDate
    }

    // Calculate current streak
    previousDate = null
    for (const log of completedLogs) {
        const logDate = parseISO(log.date)

        if (!previousDate) {
            // Check if the most recent completion was today or yesterday
            if (isToday(logDate) || isYesterday(logDate)) {
                currentStreak = 1
                previousDate = logDate
            } else {
                // Break current streak if last completion was before yesterday
                break
            }
        } else {
            const diff = differenceInDays(previousDate, logDate)
            if (diff === 1) {
                currentStreak++
                previousDate = logDate
            } else {
                break
            }
        }
    }

    return {
        current: currentStreak,
        longest: longestStreak,
        completedDays: completedLogs.length
    }
}

import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: Request) {
    const supabase = await createClient()

    const { error } = await supabase.auth.signOut()

    if (error) {
        console.error('Error signing out:', error)
    }

    // Redirect to login page after signout
    redirect('/login')
}

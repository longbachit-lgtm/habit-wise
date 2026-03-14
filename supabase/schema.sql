-- Create Habits Table
CREATE TABLE IF NOT EXISTS public.habits (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    type TEXT NOT NULL CHECK (type IN ('checkbox', 'numeric', 'time')),
    target_days INTEGER NOT NULL DEFAULT 30,
    icon TEXT DEFAULT 'CheckCircle',
    color TEXT DEFAULT 'blue',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create Habit Logs Table
CREATE TABLE IF NOT EXISTS public.habit_logs (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    value NUMERIC DEFAULT 0,
    completed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(habit_id, date)
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;

-- Create policies for habits
CREATE POLICY "Users can view their own habits" 
    ON public.habits FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own habits" 
    ON public.habits FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habits" 
    ON public.habits FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habits" 
    ON public.habits FOR DELETE 
    USING (auth.uid() = user_id);

-- Create policies for habit logs
CREATE POLICY "Users can view their own habit logs" 
    ON public.habit_logs FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM public.habits
            WHERE habits.id = habit_logs.habit_id
            AND habits.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can create their own habit logs" 
    ON public.habit_logs FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.habits
            WHERE habits.id = habit_logs.habit_id
            AND habits.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can update their own habit logs" 
    ON public.habit_logs FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM public.habits
            WHERE habits.id = habit_logs.habit_id
            AND habits.user_id = auth.uid()
        )
    );

CREATE POLICY "Users can delete their own habit logs" 
    ON public.habit_logs FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM public.habits
            WHERE habits.id = habit_logs.habit_id
            AND habits.user_id = auth.uid()
        )
    );

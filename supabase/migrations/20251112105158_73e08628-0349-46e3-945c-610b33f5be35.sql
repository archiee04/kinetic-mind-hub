-- Create exercises table
CREATE TABLE public.exercises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  muscle_group TEXT NOT NULL,
  equipment TEXT,
  difficulty TEXT NOT NULL DEFAULT 'beginner',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create junction table for workout plans and exercises
CREATE TABLE public.workout_plan_exercises (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  workout_plan_id UUID NOT NULL REFERENCES public.workout_plans(id) ON DELETE CASCADE,
  exercise_id UUID NOT NULL REFERENCES public.exercises(id) ON DELETE CASCADE,
  sets INTEGER DEFAULT 3,
  reps INTEGER DEFAULT 10,
  order_index INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(workout_plan_id, exercise_id)
);

-- Enable RLS
ALTER TABLE public.exercises ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.workout_plan_exercises ENABLE ROW LEVEL SECURITY;

-- Exercises are viewable by everyone
CREATE POLICY "Exercises are viewable by everyone" 
ON public.exercises 
FOR SELECT 
USING (true);

-- Users can view exercises in their own workout plans
CREATE POLICY "Users can view their workout plan exercises" 
ON public.workout_plan_exercises 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.workout_plans 
    WHERE workout_plans.id = workout_plan_exercises.workout_plan_id 
    AND workout_plans.user_id = auth.uid()
  )
);

-- Users can add exercises to their own workout plans
CREATE POLICY "Users can add exercises to their workout plans" 
ON public.workout_plan_exercises 
FOR INSERT 
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.workout_plans 
    WHERE workout_plans.id = workout_plan_exercises.workout_plan_id 
    AND workout_plans.user_id = auth.uid()
  )
);

-- Users can update exercises in their own workout plans
CREATE POLICY "Users can update their workout plan exercises" 
ON public.workout_plan_exercises 
FOR UPDATE 
USING (
  EXISTS (
    SELECT 1 FROM public.workout_plans 
    WHERE workout_plans.id = workout_plan_exercises.workout_plan_id 
    AND workout_plans.user_id = auth.uid()
  )
);

-- Users can delete exercises from their own workout plans
CREATE POLICY "Users can delete their workout plan exercises" 
ON public.workout_plan_exercises 
FOR DELETE 
USING (
  EXISTS (
    SELECT 1 FROM public.workout_plans 
    WHERE workout_plans.id = workout_plan_exercises.workout_plan_id 
    AND workout_plans.user_id = auth.uid()
  )
);

-- Insert sample exercises
INSERT INTO public.exercises (name, description, muscle_group, equipment, difficulty, image_url) VALUES
('Bench Press', 'Classic chest exercise for building upper body strength', 'Chest', 'Barbell', 'intermediate', 'https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=400'),
('Squat', 'Fundamental lower body exercise targeting quads and glutes', 'Legs', 'Barbell', 'intermediate', 'https://images.unsplash.com/photo-1574680096145-d05b474e2155?w=400'),
('Deadlift', 'Full body compound movement for overall strength', 'Back', 'Barbell', 'advanced', 'https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=400'),
('Pull-ups', 'Bodyweight exercise for back and biceps', 'Back', 'Pull-up Bar', 'intermediate', 'https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?w=400'),
('Push-ups', 'Classic bodyweight chest exercise', 'Chest', 'Bodyweight', 'beginner', 'https://images.unsplash.com/photo-1598971639058-fab3c3109a00?w=400'),
('Shoulder Press', 'Overhead pressing movement for shoulder development', 'Shoulders', 'Dumbbells', 'beginner', 'https://images.unsplash.com/photo-1532029837206-abbe2b7620e3?w=400'),
('Bicep Curls', 'Isolation exercise for bicep development', 'Arms', 'Dumbbells', 'beginner', 'https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?w=400'),
('Tricep Dips', 'Compound movement for tricep strength', 'Arms', 'Parallel Bars', 'intermediate', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'),
('Lunges', 'Unilateral leg exercise for balance and strength', 'Legs', 'Bodyweight', 'beginner', 'https://images.unsplash.com/photo-1601422407692-ec4eeec1d9b3?w=400'),
('Plank', 'Core stabilization exercise', 'Core', 'Bodyweight', 'beginner', 'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400'),
('Barbell Row', 'Horizontal pulling exercise for back thickness', 'Back', 'Barbell', 'intermediate', 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400'),
('Leg Press', 'Machine-based leg exercise', 'Legs', 'Machine', 'beginner', 'https://images.unsplash.com/photo-1434682881908-b43d0467b798?w=400');
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Flame, Trophy, Target, TrendingUp, Dumbbell } from "lucide-react";
import heroImage from "@/assets/hero-fitness.jpg";

interface DashboardStats {
  workoutsThisWeek: number;
  caloriesConsumed: number;
  caloriesTarget: number;
  activeGoals: number;
  achievements: number;
}

const Home = () => {
  const [stats, setStats] = useState<DashboardStats>({
    workoutsThisWeek: 0,
    caloriesConsumed: 0,
    caloriesTarget: 2000,
    activeGoals: 0,
    achievements: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      const [workouts, meals, goals, achievements] = await Promise.all([
        supabase
          .from("exercise_logs")
          .select("*")
          .eq("user_id", user.id)
          .gte("logged_at", weekAgo.toISOString()),
        supabase
          .from("meals")
          .select("calories")
          .eq("user_id", user.id)
          .gte("logged_at", new Date().toDateString()),
        supabase
          .from("goals")
          .select("*")
          .eq("user_id", user.id),
        supabase
          .from("achievements")
          .select("*")
          .eq("user_id", user.id),
      ]);

      const totalCalories = meals.data?.reduce((sum, meal) => sum + (Number(meal.calories) || 0), 0) || 0;

      setStats({
        workoutsThisWeek: workouts.data?.length || 0,
        caloriesConsumed: totalCalories,
        caloriesTarget: 2000,
        activeGoals: goals.data?.length || 0,
        achievements: achievements.data?.length || 0,
      });
    };

    fetchStats();
  }, []);

  const calorieProgress = (stats.caloriesConsumed / stats.caloriesTarget) * 100;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="relative h-48 rounded-2xl overflow-hidden shadow-glow">
        <img
          src={heroImage}
          alt="Fitness motivation"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end">
          <div className="p-6">
            <h2 className="text-3xl font-bold text-white mb-2">
              Keep the Momentum Going! 💪
            </h2>
            <p className="text-white/90">You're on fire this week</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-card hover:shadow-glow transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Workouts This Week
            </CardTitle>
            <Dumbbell className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-primary">{stats.workoutsThisWeek}</div>
            <p className="text-xs text-muted-foreground mt-1">Great progress!</p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-glow transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Calories Today
            </CardTitle>
            <Flame className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">
              {Math.round(stats.caloriesConsumed)}
            </div>
            <Progress value={calorieProgress} className="mt-2" />
            <p className="text-xs text-muted-foreground mt-1">
              {stats.caloriesTarget - stats.caloriesConsumed} kcal remaining
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-glow transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Active Goals
            </CardTitle>
            <Target className="h-4 w-4 text-accent" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-accent">{stats.activeGoals}</div>
            <p className="text-xs text-muted-foreground mt-1">Stay focused!</p>
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-glow transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Achievements
            </CardTitle>
            <Trophy className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-secondary">{stats.achievements}</div>
            <p className="text-xs text-muted-foreground mt-1">Keep earning badges!</p>
          </CardContent>
        </Card>
      </div>

      <Card className="shadow-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-primary" />
            Quick Tips
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
            <p className="text-sm font-medium">💧 Stay Hydrated</p>
            <p className="text-xs text-muted-foreground mt-1">
              Drink at least 8 glasses of water today
            </p>
          </div>
          <div className="p-4 rounded-lg bg-accent/10 border border-accent/20">
            <p className="text-sm font-medium">🎯 Set Your Goals</p>
            <p className="text-xs text-muted-foreground mt-1">
              Head to Tracking to define your fitness targets
            </p>
          </div>
          <div className="p-4 rounded-lg bg-secondary/10 border border-secondary/20">
            <p className="text-sm font-medium">💪 Log Your Workout</p>
            <p className="text-xs text-muted-foreground mt-1">
              Don't forget to track today's exercise session
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Home;

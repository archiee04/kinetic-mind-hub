import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Dumbbell, Clock, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface WorkoutPlan {
  id: string;
  plan_name: string;
  difficulty: string;
  duration: string;
  created_at: string;
}

interface ExerciseLog {
  id: string;
  exercise_name: string;
  sets: number;
  reps: number;
  weight: number;
  logged_at: string;
}

const Workouts = () => {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [recentExercises, setRecentExercises] = useState<ExerciseLog[]>([]);
  const [isAddPlanOpen, setIsAddPlanOpen] = useState(false);
  const [isLogExerciseOpen, setIsLogExerciseOpen] = useState(false);
  const [newPlan, setNewPlan] = useState<{
    plan_name: string;
    difficulty: "beginner" | "intermediate" | "advanced";
    duration: string;
  }>({
    plan_name: "",
    difficulty: "beginner",
    duration: "4 weeks",
  });
  const [newExercise, setNewExercise] = useState({
    exercise_name: "",
    sets: 3,
    reps: 10,
    weight: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [plansData, exercisesData] = await Promise.all([
      supabase
        .from("workout_plans")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
      supabase
        .from("exercise_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("logged_at", { ascending: false })
        .limit(5),
    ]);

    if (plansData.data) setPlans(plansData.data);
    if (exercisesData.data) setRecentExercises(exercisesData.data);
  };

  const handleAddPlan = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("workout_plans").insert([{
      user_id: user.id,
      ...newPlan,
    }]);

    if (error) {
      toast.error("Failed to create workout plan");
    } else {
      toast.success("Workout plan created!");
      setIsAddPlanOpen(false);
      setNewPlan({ plan_name: "", difficulty: "beginner", duration: "4 weeks" });
      fetchData();
    }
  };

  const handleLogExercise = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("exercise_logs").insert([{
      user_id: user.id,
      ...newExercise,
    }]);

    if (error) {
      toast.error("Failed to log exercise");
    } else {
      toast.success("Exercise logged!");
      setIsLogExerciseOpen(false);
      setNewExercise({ exercise_name: "", sets: 3, reps: 10, weight: 0 });
      fetchData();
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Workout Plans</h1>
        <div className="flex gap-2">
          <Dialog open={isLogExerciseOpen} onOpenChange={setIsLogExerciseOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <TrendingUp className="h-4 w-4" />
                Log Exercise
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Exercise</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Exercise Name</Label>
                  <Input
                    value={newExercise.exercise_name}
                    onChange={(e) =>
                      setNewExercise({ ...newExercise, exercise_name: e.target.value })
                    }
                    placeholder="e.g., Bench Press"
                  />
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <Label>Sets</Label>
                    <Input
                      type="number"
                      value={newExercise.sets}
                      onChange={(e) =>
                        setNewExercise({ ...newExercise, sets: parseInt(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <Label>Reps</Label>
                    <Input
                      type="number"
                      value={newExercise.reps}
                      onChange={(e) =>
                        setNewExercise({ ...newExercise, reps: parseInt(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <Label>Weight (lbs)</Label>
                    <Input
                      type="number"
                      value={newExercise.weight}
                      onChange={(e) =>
                        setNewExercise({ ...newExercise, weight: parseFloat(e.target.value) })
                      }
                    />
                  </div>
                </div>
                <Button onClick={handleLogExercise} className="w-full">
                  Log Exercise
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddPlanOpen} onOpenChange={setIsAddPlanOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 gradient-hero">
                <Plus className="h-4 w-4" />
                New Plan
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Workout Plan</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Plan Name</Label>
                  <Input
                    value={newPlan.plan_name}
                    onChange={(e) => setNewPlan({ ...newPlan, plan_name: e.target.value })}
                    placeholder="e.g., Upper Body Strength"
                  />
                </div>
                <div>
                  <Label>Difficulty</Label>
                  <Select
                    value={newPlan.difficulty}
                    onValueChange={(value: "beginner" | "intermediate" | "advanced") => 
                      setNewPlan({ ...newPlan, difficulty: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Duration</Label>
                  <Input
                    value={newPlan.duration}
                    onChange={(e) => setNewPlan({ ...newPlan, duration: e.target.value })}
                    placeholder="e.g., 4 weeks"
                  />
                </div>
                <Button onClick={handleAddPlan} className="w-full gradient-hero">
                  Create Plan
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {plans.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Dumbbell className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground">No workout plans yet</p>
            <p className="text-sm text-muted-foreground mb-4">Create your first plan to get started</p>
            <Button onClick={() => setIsAddPlanOpen(true)} className="gradient-hero">
              Create Plan
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {plans.map((plan) => (
            <Card key={plan.id} className="shadow-card hover:shadow-glow transition-shadow">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Dumbbell className="h-5 w-5 text-primary" />
                  {plan.plan_name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <span className="px-2 py-1 rounded-full bg-primary/10 text-primary capitalize">
                    {plan.difficulty}
                  </span>
                  <span className="flex items-center gap-1 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    {plan.duration}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground">
                  Created {new Date(plan.created_at).toLocaleDateString()}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {recentExercises.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Recent Exercises</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentExercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                >
                  <div>
                    <p className="font-medium">{exercise.exercise_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {exercise.sets} sets × {exercise.reps} reps @ {exercise.weight} lbs
                    </p>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {new Date(exercise.logged_at).toLocaleDateString()}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Workouts;

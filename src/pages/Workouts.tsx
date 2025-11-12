import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Dumbbell, Clock, TrendingUp, X } from "lucide-react";
import { toast } from "sonner";
import { AICoachDialog } from "@/components/AICoachDialog";
import { ExerciseSelector } from "@/components/ExerciseSelector";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
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

interface Exercise {
  id: string;
  name: string;
  description: string;
  image_url: string;
  muscle_group: string;
  equipment: string;
  difficulty: string;
}

interface PlanExercise extends Exercise {
  sets: number;
  reps: number;
  order_index: number;
}

const Workouts = () => {
  const [plans, setPlans] = useState<WorkoutPlan[]>([]);
  const [recentExercises, setRecentExercises] = useState<ExerciseLog[]>([]);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [goals, setGoals] = useState<any[]>([]);
  const [isAddPlanOpen, setIsAddPlanOpen] = useState(false);
  const [isLogExerciseOpen, setIsLogExerciseOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<WorkoutPlan | null>(null);
  const [planExercises, setPlanExercises] = useState<PlanExercise[]>([]);
  const [selectedExerciseIds, setSelectedExerciseIds] = useState<string[]>([]);
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

    const [plansData, exercisesData, profileData, goalsData] = await Promise.all([
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
      supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single(),
      supabase
        .from("goals")
        .select("*")
        .eq("user_id", user.id),
    ]);

    if (plansData.data) setPlans(plansData.data);
    if (exercisesData.data) setRecentExercises(exercisesData.data);
    if (profileData.data) setUserProfile(profileData.data);
    if (goalsData.data) setGoals(goalsData.data);
  };

  const handleAddPlan = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    if (selectedExerciseIds.length === 0) {
      toast.error("Please select at least one exercise");
      return;
    }

    const { data: planData, error: planError } = await supabase
      .from("workout_plans")
      .insert([{
        user_id: user.id,
        ...newPlan,
      }])
      .select()
      .single();

    if (planError) {
      toast.error("Failed to create workout plan");
      return;
    }

    // Add exercises to the plan
    const exercisesToAdd = selectedExerciseIds.map((exerciseId, index) => ({
      workout_plan_id: planData.id,
      exercise_id: exerciseId,
      sets: 3,
      reps: 10,
      order_index: index,
    }));

    const { error: exercisesError } = await supabase
      .from("workout_plan_exercises")
      .insert(exercisesToAdd);

    if (exercisesError) {
      toast.error("Failed to add exercises to plan");
      return;
    }

    toast.success("Workout plan created with exercises!");
    setIsAddPlanOpen(false);
    setNewPlan({ plan_name: "", difficulty: "beginner", duration: "4 weeks" });
    setSelectedExerciseIds([]);
    fetchData();
  };

  const fetchPlanExercises = async (planId: string) => {
    const { data, error } = await supabase
      .from("workout_plan_exercises")
      .select(`
        sets,
        reps,
        order_index,
        exercises (
          id,
          name,
          description,
          image_url,
          muscle_group,
          equipment,
          difficulty
        )
      `)
      .eq("workout_plan_id", planId)
      .order("order_index");

    if (data && !error) {
      const formattedExercises = data.map((item: any) => ({
        ...item.exercises,
        sets: item.sets,
        reps: item.reps,
        order_index: item.order_index,
      }));
      setPlanExercises(formattedExercises);
    }
  };

  const handlePlanClick = async (plan: WorkoutPlan) => {
    setSelectedPlan(plan);
    await fetchPlanExercises(plan.id);
  };

  const toggleExerciseSelection = (exerciseId: string) => {
    setSelectedExerciseIds((prev) =>
      prev.includes(exerciseId)
        ? prev.filter((id) => id !== exerciseId)
        : [...prev, exerciseId]
    );
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
          <AICoachDialog
            type="workout"
            userContext={{
              profile: userProfile,
              goals,
              recentExercises,
              plans,
            }}
            buttonText="AI Workout Coach"
            title="AI Workout Recommendations"
            placeholder="Describe your fitness goals, available equipment, or ask for workout advice..."
          />
          
          <AICoachDialog
            type="form"
            userContext={null}
            buttonText="Form Check"
            title="AI Form Analysis"
            placeholder="Describe the exercise and any issues you're experiencing, or ask about proper form..."
          />
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
            <DialogContent className="max-w-6xl max-h-[90vh]">
              <DialogHeader>
                <DialogTitle>Create Workout Plan</DialogTitle>
              </DialogHeader>
              <Tabs defaultValue="details" className="w-full">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="details">Plan Details</TabsTrigger>
                  <TabsTrigger value="exercises">Select Exercises</TabsTrigger>
                </TabsList>
                <TabsContent value="details" className="space-y-4 mt-4">
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
                </TabsContent>
                <TabsContent value="exercises" className="mt-4">
                  <ExerciseSelector
                    selectedExercises={selectedExerciseIds}
                    onToggleExercise={toggleExerciseSelection}
                  />
                </TabsContent>
              </Tabs>
              <Button onClick={handleAddPlan} className="w-full gradient-hero">
                Create Plan with {selectedExerciseIds.length} Exercise{selectedExerciseIds.length !== 1 ? 's' : ''}
              </Button>
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
            <Card 
              key={plan.id} 
              className="shadow-card hover:shadow-glow transition-shadow cursor-pointer"
              onClick={() => handlePlanClick(plan)}
            >
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

      {/* Workout Plan Details Dialog */}
      <Dialog open={!!selectedPlan} onOpenChange={() => setSelectedPlan(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Dumbbell className="h-5 w-5 text-primary" />
              {selectedPlan?.plan_name}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="px-3 py-1 rounded-full bg-primary/10 text-primary capitalize font-medium">
                {selectedPlan?.difficulty}
              </div>
              <div className="flex items-center gap-2 text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>{selectedPlan?.duration}</span>
              </div>
            </div>
            <div className="text-sm text-muted-foreground">
              Created on {selectedPlan && new Date(selectedPlan.created_at).toLocaleDateString()}
            </div>
            
            {planExercises.length > 0 ? (
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Exercises</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {planExercises.map((exercise) => (
                    <Card key={exercise.id} className="overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex gap-3 p-3">
                          <img
                            src={exercise.image_url}
                            alt={exercise.name}
                            className="w-20 h-20 object-cover rounded"
                          />
                          <div className="flex-1 space-y-1">
                            <h4 className="font-semibold">{exercise.name}</h4>
                            <p className="text-sm text-muted-foreground">
                              {exercise.sets} sets × {exercise.reps} reps
                            </p>
                            <div className="flex gap-1">
                              <Badge variant="secondary" className="text-xs">
                                {exercise.muscle_group}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-lg bg-muted/50">
                <p className="text-sm text-muted-foreground">
                  No exercises added to this plan yet.
                </p>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>

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

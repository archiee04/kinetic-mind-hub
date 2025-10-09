import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, UtensilsCrossed, Flame } from "lucide-react";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

interface Meal {
  id: string;
  name: string;
  calories: number;
  protein: number;
  carbs: number;
  fats: number;
  logged_at: string;
}

interface NutritionGoal {
  daily_calories_target: number;
  protein_target: number;
  carb_target: number;
  fat_target: number;
}

const Diet = () => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [goals, setGoals] = useState<NutritionGoal>({
    daily_calories_target: 2000,
    protein_target: 150,
    carb_target: 250,
    fat_target: 70,
  });
  const [isAddMealOpen, setIsAddMealOpen] = useState(false);
  const [newMeal, setNewMeal] = useState({
    name: "",
    calories: 0,
    protein: 0,
    carbs: 0,
    fats: 0,
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const today = new Date().toDateString();
    const [mealsData, goalsData] = await Promise.all([
      supabase
        .from("meals")
        .select("*")
        .eq("user_id", user.id)
        .gte("logged_at", today)
        .order("logged_at", { ascending: false }),
      supabase
        .from("nutrition_goals")
        .select("*")
        .eq("user_id", user.id)
        .limit(1)
        .single(),
    ]);

    if (mealsData.data) setMeals(mealsData.data);
    if (goalsData.data) setGoals(goalsData.data);
  };

  const handleAddMeal = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("meals").insert([{
      user_id: user.id,
      ...newMeal,
    }]);

    if (error) {
      toast.error("Failed to log meal");
    } else {
      toast.success("Meal logged!");
      setIsAddMealOpen(false);
      setNewMeal({ name: "", calories: 0, protein: 0, carbs: 0, fats: 0 });
      fetchData();
    }
  };

  const totals = meals.reduce(
    (acc, meal) => ({
      calories: acc.calories + Number(meal.calories),
      protein: acc.protein + Number(meal.protein),
      carbs: acc.carbs + Number(meal.carbs),
      fats: acc.fats + Number(meal.fats),
    }),
    { calories: 0, protein: 0, carbs: 0, fats: 0 }
  );

  const calorieProgress = (totals.calories / goals.daily_calories_target) * 100;
  const proteinProgress = (totals.protein / goals.protein_target) * 100;
  const carbProgress = (totals.carbs / goals.carb_target) * 100;
  const fatProgress = (totals.fats / goals.fat_target) * 100;

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Diet & Nutrition</h1>
        <Dialog open={isAddMealOpen} onOpenChange={setIsAddMealOpen}>
          <DialogTrigger asChild>
            <Button className="gap-2 gradient-hero">
              <Plus className="h-4 w-4" />
              Log Meal
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Log Meal</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <Label>Meal Name</Label>
                <Input
                  value={newMeal.name}
                  onChange={(e) => setNewMeal({ ...newMeal, name: e.target.value })}
                  placeholder="e.g., Chicken & Rice"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Calories</Label>
                  <Input
                    type="number"
                    value={newMeal.calories}
                    onChange={(e) =>
                      setNewMeal({ ...newMeal, calories: parseFloat(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label>Protein (g)</Label>
                  <Input
                    type="number"
                    value={newMeal.protein}
                    onChange={(e) =>
                      setNewMeal({ ...newMeal, protein: parseFloat(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label>Carbs (g)</Label>
                  <Input
                    type="number"
                    value={newMeal.carbs}
                    onChange={(e) =>
                      setNewMeal({ ...newMeal, carbs: parseFloat(e.target.value) })
                    }
                  />
                </div>
                <div>
                  <Label>Fats (g)</Label>
                  <Input
                    type="number"
                    value={newMeal.fats}
                    onChange={(e) =>
                      setNewMeal({ ...newMeal, fats: parseFloat(e.target.value) })
                    }
                  />
                </div>
              </div>
              <Button onClick={handleAddMeal} className="w-full gradient-hero">
                Log Meal
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="shadow-card hover:shadow-glow transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
              <Flame className="h-4 w-4 text-secondary" />
              Calories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(totals.calories)} / {goals.daily_calories_target}
            </div>
            <Progress value={calorieProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-glow transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Protein
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(totals.protein)}g / {goals.protein_target}g
            </div>
            <Progress value={proteinProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-glow transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Carbs
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(totals.carbs)}g / {goals.carb_target}g
            </div>
            <Progress value={carbProgress} className="mt-2" />
          </CardContent>
        </Card>

        <Card className="shadow-card hover:shadow-glow transition-shadow">
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Fats
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {Math.round(totals.fats)}g / {goals.fat_target}g
            </div>
            <Progress value={fatProgress} className="mt-2" />
          </CardContent>
        </Card>
      </div>

      {meals.length === 0 ? (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <UtensilsCrossed className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground">No meals logged today</p>
            <p className="text-sm text-muted-foreground mb-4">Start tracking your nutrition</p>
            <Button onClick={() => setIsAddMealOpen(true)} className="gradient-hero">
              Log First Meal
            </Button>
          </CardContent>
        </Card>
      ) : (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>Today's Meals</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {meals.map((meal) => (
                <div
                  key={meal.id}
                  className="p-4 rounded-lg border bg-card hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium">{meal.name}</p>
                    <p className="text-sm text-secondary font-semibold">
                      {Math.round(meal.calories)} cal
                    </p>
                  </div>
                  <div className="flex gap-4 text-xs text-muted-foreground">
                    <span>Protein: {Math.round(meal.protein)}g</span>
                    <span>Carbs: {Math.round(meal.carbs)}g</span>
                    <span>Fats: {Math.round(meal.fats)}g</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Diet;

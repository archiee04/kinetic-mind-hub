import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Activity, Heart, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
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

interface VitalLog {
  id: string;
  weight?: number;
  body_fat?: number;
  heart_rate?: number;
  sleep_hours?: number;
  logged_at: string;
}

interface Goal {
  id: string;
  goal_type: string;
  target_value: number;
  current_value: number;
  progress: number;
  deadline: string;
}

const Tracking = () => {
  const [vitals, setVitals] = useState<VitalLog[]>([]);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [isAddVitalOpen, setIsAddVitalOpen] = useState(false);
  const [isAddGoalOpen, setIsAddGoalOpen] = useState(false);
  const [newVital, setNewVital] = useState({
    weight: 0,
    body_fat: 0,
    heart_rate: 0,
    sleep_hours: 0,
  });
  const [newGoal, setNewGoal] = useState<{
    goal_type: "weight_loss" | "muscle_gain" | "endurance" | "flexibility" | "general_fitness";
    target_value: number;
    current_value: number;
    deadline: string;
  }>({
    goal_type: "weight_loss",
    target_value: 0,
    current_value: 0,
    deadline: "",
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const [vitalsData, goalsData] = await Promise.all([
      supabase
        .from("vitals_logs")
        .select("*")
        .eq("user_id", user.id)
        .order("logged_at", { ascending: true })
        .limit(30),
      supabase
        .from("goals")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false }),
    ]);

    if (vitalsData.data) setVitals(vitalsData.data);
    if (goalsData.data) setGoals(goalsData.data);
  };

  const handleAddVital = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { error } = await supabase.from("vitals_logs").insert([{
      user_id: user.id,
      ...newVital,
    }]);

    if (error) {
      toast.error("Failed to log vitals");
    } else {
      toast.success("Vitals logged!");
      setIsAddVitalOpen(false);
      setNewVital({ weight: 0, body_fat: 0, heart_rate: 0, sleep_hours: 0 });
      fetchData();
    }
  };

  const handleAddGoal = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const progress = (newGoal.current_value / newGoal.target_value) * 100;

    const { error } = await supabase.from("goals").insert([{
      user_id: user.id,
      ...newGoal,
      progress,
    }]);

    if (error) {
      toast.error("Failed to create goal");
    } else {
      toast.success("Goal created!");
      setIsAddGoalOpen(false);
      setNewGoal({
        goal_type: "weight_loss",
        target_value: 0,
        current_value: 0,
        deadline: "",
      });
      fetchData();
    }
  };

  const weightData = vitals
    .filter((v) => v.weight)
    .map((v) => ({
      date: new Date(v.logged_at).toLocaleDateString(),
      weight: v.weight,
    }));

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Progress Tracking</h1>
        <div className="flex gap-2">
          <Dialog open={isAddVitalOpen} onOpenChange={setIsAddVitalOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="gap-2">
                <Activity className="h-4 w-4" />
                Log Vitals
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Log Vitals</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Weight (lbs)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={newVital.weight}
                      onChange={(e) =>
                        setNewVital({ ...newVital, weight: parseFloat(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <Label>Body Fat %</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={newVital.body_fat}
                      onChange={(e) =>
                        setNewVital({ ...newVital, body_fat: parseFloat(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <Label>Heart Rate (bpm)</Label>
                    <Input
                      type="number"
                      value={newVital.heart_rate}
                      onChange={(e) =>
                        setNewVital({ ...newVital, heart_rate: parseInt(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <Label>Sleep (hours)</Label>
                    <Input
                      type="number"
                      step="0.1"
                      value={newVital.sleep_hours}
                      onChange={(e) =>
                        setNewVital({ ...newVital, sleep_hours: parseFloat(e.target.value) })
                      }
                    />
                  </div>
                </div>
                <Button onClick={handleAddVital} className="w-full gradient-hero">
                  Log Vitals
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          <Dialog open={isAddGoalOpen} onOpenChange={setIsAddGoalOpen}>
            <DialogTrigger asChild>
              <Button className="gap-2 gradient-hero">
                <Plus className="h-4 w-4" />
                New Goal
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create Goal</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Goal Type</Label>
                  <Select
                    value={newGoal.goal_type}
                    onValueChange={(value: "weight_loss" | "muscle_gain" | "endurance" | "flexibility" | "general_fitness") =>
                      setNewGoal({ ...newGoal, goal_type: value })
                    }
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="weight_loss">Weight Loss</SelectItem>
                      <SelectItem value="muscle_gain">Muscle Gain</SelectItem>
                      <SelectItem value="endurance">Endurance</SelectItem>
                      <SelectItem value="flexibility">Flexibility</SelectItem>
                      <SelectItem value="general_fitness">General Fitness</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Current Value</Label>
                    <Input
                      type="number"
                      value={newGoal.current_value}
                      onChange={(e) =>
                        setNewGoal({ ...newGoal, current_value: parseFloat(e.target.value) })
                      }
                    />
                  </div>
                  <div>
                    <Label>Target Value</Label>
                    <Input
                      type="number"
                      value={newGoal.target_value}
                      onChange={(e) =>
                        setNewGoal({ ...newGoal, target_value: parseFloat(e.target.value) })
                      }
                    />
                  </div>
                </div>
                <div>
                  <Label>Deadline</Label>
                  <Input
                    type="date"
                    value={newGoal.deadline}
                    onChange={(e) => setNewGoal({ ...newGoal, deadline: e.target.value })}
                  />
                </div>
                <Button onClick={handleAddGoal} className="w-full gradient-hero">
                  Create Goal
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {weightData.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-primary" />
              Weight Progress
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={250}>
              <LineChart data={weightData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="weight" 
                  stroke="hsl(var(--primary))" 
                  strokeWidth={2}
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      )}

      {goals.length > 0 && (
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Heart className="h-5 w-5 text-accent" />
              Active Goals
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {goals.map((goal) => (
                <div key={goal.id} className="p-4 rounded-lg border bg-card">
                  <div className="flex items-center justify-between mb-2">
                    <p className="font-medium capitalize">{goal.goal_type.replace(/_/g, " ")}</p>
                    <span className="text-sm text-muted-foreground">
                      {new Date(goal.deadline).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm mb-2">
                    <span>Current: {goal.current_value}</span>
                    <span>Target: {goal.target_value}</span>
                  </div>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <span>Progress</span>
                      <span>{Math.round(goal.progress)}%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div
                        className="h-full bg-accent transition-all"
                        style={{ width: `${Math.min(goal.progress, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {goals.length === 0 && vitals.length === 0 && (
        <Card className="shadow-card">
          <CardContent className="flex flex-col items-center justify-center py-12">
            <Activity className="h-12 w-12 text-muted-foreground mb-4" />
            <p className="text-lg font-medium text-muted-foreground">Start tracking your progress</p>
            <p className="text-sm text-muted-foreground mb-4">Log vitals and set goals to see your journey</p>
            <div className="flex gap-2">
              <Button onClick={() => setIsAddVitalOpen(true)} variant="outline">
                Log Vitals
              </Button>
              <Button onClick={() => setIsAddGoalOpen(true)} className="gradient-hero">
                Create Goal
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Tracking;

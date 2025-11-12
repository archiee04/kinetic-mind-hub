import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, Plus, Check } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Exercise {
  id: string;
  name: string;
  description: string;
  image_url: string;
  muscle_group: string;
  equipment: string;
  difficulty: string;
}

interface ExerciseSelectorProps {
  selectedExercises: string[];
  onToggleExercise: (exerciseId: string) => void;
}

export const ExerciseSelector = ({ selectedExercises, onToggleExercise }: ExerciseSelectorProps) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [filteredExercises, setFilteredExercises] = useState<Exercise[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [muscleFilter, setMuscleFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");

  useEffect(() => {
    fetchExercises();
  }, []);

  useEffect(() => {
    filterExercises();
  }, [exercises, searchTerm, muscleFilter, difficultyFilter]);

  const fetchExercises = async () => {
    const { data, error } = await supabase
      .from("exercises")
      .select("*")
      .order("name");

    if (data && !error) {
      setExercises(data);
    }
  };

  const filterExercises = () => {
    let filtered = exercises;

    if (searchTerm) {
      filtered = filtered.filter((ex) =>
        ex.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (muscleFilter !== "all") {
      filtered = filtered.filter((ex) => ex.muscle_group === muscleFilter);
    }

    if (difficultyFilter !== "all") {
      filtered = filtered.filter((ex) => ex.difficulty === difficultyFilter);
    }

    setFilteredExercises(filtered);
  };

  const muscleGroups = [...new Set(exercises.map((ex) => ex.muscle_group))];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search exercises..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={muscleFilter} onValueChange={setMuscleFilter}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="All Muscle Groups" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Muscle Groups</SelectItem>
              {muscleGroups.map((group) => (
                <SelectItem key={group} value={group}>
                  {group}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select value={difficultyFilter} onValueChange={setDifficultyFilter}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="All Difficulties" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Difficulties</SelectItem>
              <SelectItem value="beginner">Beginner</SelectItem>
              <SelectItem value="intermediate">Intermediate</SelectItem>
              <SelectItem value="advanced">Advanced</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <ScrollArea className="h-[500px] pr-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredExercises.map((exercise) => {
            const isSelected = selectedExercises.includes(exercise.id);
            return (
              <Card
                key={exercise.id}
                className={`cursor-pointer transition-all hover:shadow-glow ${
                  isSelected ? "ring-2 ring-primary shadow-glow" : ""
                }`}
                onClick={() => onToggleExercise(exercise.id)}
              >
                <CardContent className="p-0">
                  <div className="relative">
                    <img
                      src={exercise.image_url}
                      alt={exercise.name}
                      className="w-full h-40 object-cover rounded-t-lg"
                    />
                    {isSelected && (
                      <div className="absolute top-2 right-2 bg-primary text-primary-foreground rounded-full p-1">
                        <Check className="h-4 w-4" />
                      </div>
                    )}
                  </div>
                  <div className="p-4 space-y-2">
                    <h3 className="font-semibold text-lg">{exercise.name}</h3>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {exercise.description}
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="secondary">{exercise.muscle_group}</Badge>
                      <Badge variant="outline" className="capitalize">
                        {exercise.difficulty}
                      </Badge>
                      {exercise.equipment && (
                        <Badge variant="outline">{exercise.equipment}</Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </ScrollArea>

      <div className="text-sm text-muted-foreground">
        {selectedExercises.length} exercise{selectedExercises.length !== 1 ? "s" : ""} selected
      </div>
    </div>
  );
};

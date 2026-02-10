

export interface WorkoutE
{
    workout_id: number,
    name: string,
    description: string,
    type: number,
    durationMinutes: number,
    exercises: WorkoutExercise[];
}

export interface WorkoutExercise 
{
  workout_id: number;
  exercise_id: number;
  sequence_order: number;
  plannedSets: number;
  plannedReps: number;
  plannedWeight: number;
  name: string;
  description: string;
  muscle_group_name: string;
}
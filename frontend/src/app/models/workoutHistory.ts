export interface WorkOutHistory
{
  history_id: number;
  user_id:number;
  date?: Date;
  durationMinutes:number,
  notes:string,
  workout_name:string,
}


export interface WorkoutHistoryLogCreate {
  exercise_id: number;
  set_number: number;
  weight: number;
  reps: number;
}

export interface CreateWorkOutHistoryPayload {
  WORKOUT_workout_id: number;
  durationMinutes: number;
  notes: string;
  date: string; 
  logs: WorkoutHistoryLogCreate[];
}
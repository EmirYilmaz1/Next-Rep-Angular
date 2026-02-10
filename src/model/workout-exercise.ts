import { HttpError } from "../helpers/errors";

export class WorkoutExercise {
  workout_id: number;
  exercise_id: number;
  sequence_order: number;
  plannedSets: number;
  plannedReps: number;
  plannedWeight: number;

  constructor(
    workout_id: number,
    exercise_id: number,
    sequence_order: number,
    plannedSets: number,
    plannedReps: number,
    plannedWeight: number
  ) {
    if (typeof workout_id !== 'number' || workout_id <= 0) throw new HttpError(400, 'Invalid workout ID');
    if (typeof exercise_id !== 'number' || exercise_id <= 0) throw new HttpError(400, 'Invalid exercise ID');
    
    if (typeof sequence_order !== 'number' || sequence_order <= 0) {
      throw new HttpError(400, 'Invalid sequence order');
    }

    if (typeof plannedSets !== 'number' || plannedSets <= 0) {
      throw new HttpError(400, 'Invalid planned sets');
    }

    if (typeof plannedReps !== 'number' || plannedReps <= 0) {
      throw new HttpError(400, 'Invalid planned reps');
    }

    if (typeof plannedWeight !== 'number' || plannedWeight <= 0) {
      throw new HttpError(400, 'Invalid planned weight');
    }

    this.workout_id = workout_id;
    this.exercise_id = exercise_id;
    this.sequence_order = sequence_order;
    this.plannedSets = plannedSets;
    this.plannedReps = plannedReps;
    this.plannedWeight = plannedWeight;
  }
}

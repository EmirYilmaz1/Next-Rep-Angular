import { HttpError } from "../helpers/errors";

export class ExerciseLog {
  log_id: number;
  WORKOUT_HISTORY_history_id: number;
  EXERCISE_exercise_id: number;
  set_number: number;
  weight: number;
  reps: number;

  constructor(
    WORKOUT_HISTORY_history_id: number,
    EXERCISE_exercise_id: number,
    set_number: number,
    weight: number,
    reps: number
  ) {
    if (typeof WORKOUT_HISTORY_history_id !== 'number' || WORKOUT_HISTORY_history_id <= 0) {
      throw new HttpError(400, 'Invalid history ID');
    }

    if (typeof EXERCISE_exercise_id !== 'number' || EXERCISE_exercise_id <= 0) {
      throw new HttpError(400, 'Invalid exercise ID');
    }

    if (typeof set_number !== 'number' || set_number <= 0) {
      throw new HttpError(400, 'Invalid set number');
    }

    if (typeof weight !== 'number' || weight < 0) {
      throw new HttpError(400, 'Invalid weight');
    }

    if (typeof reps !== 'number' || reps <= 0) {
      throw new HttpError(400, 'Invalid reps');
    }

    this.log_id = 0;
    this.WORKOUT_HISTORY_history_id = WORKOUT_HISTORY_history_id;
    this.EXERCISE_exercise_id = EXERCISE_exercise_id;
    this.set_number = set_number;
    this.weight = weight;
    this.reps = reps;
  }
}

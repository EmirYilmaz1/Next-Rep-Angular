import { HttpError } from "../helpers/errors";

export class WorkoutHistory {
  history_id: number;
  USER_user_id: number;
  WORKOUT_workout_id: number; 
  date: Date;
  durationMinutes: number;
  notes?: string;

  constructor(
    USER_user_id: number,
    WORKOUT_workout_id: number,
    durationMinutes: number,
    date?: Date | string,
    notes?: string
  ) {
    if (typeof USER_user_id !== 'number' || USER_user_id <= 0) {
      throw new HttpError(400, 'Invalid user ID');
    }
    if (WORKOUT_workout_id === null) {
      throw new HttpError(400, 'Workout ID must be set');
    }

    if (WORKOUT_workout_id !== null && (typeof WORKOUT_workout_id !== 'number' || WORKOUT_workout_id <= 0)) {
      throw new HttpError(400, 'Invalid workout ID');
    }

    let parsedDate = new Date();
    if (date) {
        parsedDate = new Date(date);
        if (isNaN(parsedDate.getTime())) {
            throw new HttpError(400, 'Invalid date format');
        }
        
        if (parsedDate > new Date()) {
            throw new HttpError(400, 'Date cannot be in the future');
        }
    }

    if (typeof durationMinutes !== 'number' || durationMinutes < 0 || durationMinutes > 1440) {
      throw new HttpError(400, 'Invalid duration (0-1440 min)');
    }

    if (notes && (typeof notes !== 'string' || notes.length > 500)) {
      throw new HttpError(400, 'Notes too long (max 500 chars)');
    }

    this.history_id = 0;
    this.USER_user_id = USER_user_id;
    this.WORKOUT_workout_id = WORKOUT_workout_id;
    this.date = parsedDate;
    this.durationMinutes = durationMinutes;
    this.notes = notes ? notes.trim() : undefined;
  }
}

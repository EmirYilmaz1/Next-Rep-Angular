import { HttpError } from "../helpers/errors";

export class Workout {
  workout_id: number;
  name: string;
  description: string;
  type: number;
  durationMinutes: number;

  constructor(name: string, description: string, type: number, durationMinutes: number) {
    if (!name || typeof name !== 'string' || (name = name.trim()).length === 0 || name.length > 45) {
      throw new HttpError(400, 'Workout name invalid (1-45 chars)');
    }

    if (!description || typeof description !== 'string' || (description = description.trim()).length > 255) {
      throw new HttpError(400, 'Description invalid (max 255 chars)');
    }

    // Type mora biti broj (npr. 0-10, ovisno o tvojoj logici tipova)
    if (typeof type !== 'number' || type < 0) {
      throw new HttpError(400, 'Invalid workout type');
    }

    if (typeof durationMinutes !== 'number' || durationMinutes <= 0 || durationMinutes > 1440) { // Max 24h
      throw new HttpError(400, 'Invalid duration (1-1440 min)');
    }

    this.workout_id = 0;
    this.name = name;
    this.description = description;
    this.type = type;
    this.durationMinutes = durationMinutes;
  }
}

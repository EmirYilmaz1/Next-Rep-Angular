import { HttpError } from "../helpers/errors";

export class Exercise {
  exercise_id: number;
  EQUIPMENT_equipment_id: number | null;
  name: string;
  description: string;
  MUSCLE_GROUP_id: number;

  constructor(
    EQUIPMENT_equipment_id: number | null,
    name: string,
    description: string,
    muscle_group_id: number
  ) {
    if (EQUIPMENT_equipment_id !== null && (typeof EQUIPMENT_equipment_id !== 'number' || EQUIPMENT_equipment_id <= 0)) {
       
       throw new HttpError(400, 'Invalid equipment ID');
    }

    if (!name || typeof name !== 'string' || (name = name.trim()).length === 0 || name.length > 45) {
      throw new HttpError(400, 'Exercise name invalid (1-45 chars)');
    }
    
    if (!description || typeof description !== 'string' || (description = description.trim()).length > 255) {
      throw new HttpError(400, 'Description invalid (max 255 chars)');
    }

    this.exercise_id = 0;
    this.EQUIPMENT_equipment_id = EQUIPMENT_equipment_id;
    this.name = name;
    this.description = description;
    this.MUSCLE_GROUP_id = muscle_group_id;
  }
}

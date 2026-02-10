import { HttpError } from "../helpers/errors";

export class Equipment {
  equipment_id: number;
  name: string;
  description: string;
  alternatives?: string;

  constructor(name: string, description: string, alternatives?: string) {
    if (!name || typeof name !== 'string' || (name = name.trim()).length === 0 || name.length > 45) {
      throw new HttpError(400, 'Equipment name invalid (1-45 chars)');
    }
    if (!description || typeof description !== 'string' || (description = description.trim()).length === 0 || description.length > 255) {
      throw new HttpError(400, 'Equipment description invalid (1-255 chars)');
    }
    if (alternatives && (typeof alternatives !== 'string' || alternatives.length > 255)) {
      throw new HttpError(400, 'Alternatives too long (max 255 chars)');
    }

    this.equipment_id = 0;
    this.name = name;
    this.description = description;
    this.alternatives = alternatives ? alternatives.trim() : undefined;
  }
}

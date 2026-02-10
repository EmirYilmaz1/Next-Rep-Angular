import { HttpError } from "../helpers/errors";

export class Role {
  role_id: number;
  name: string;
  description: string;

  constructor(name: string, description: string) {
    if (!name || typeof name !== 'string' || (name = name.trim()).length === 0 || name.length > 45)
      throw new HttpError(400, 'Role name invalid (1-45 chars)');
    if (!description || typeof description !== 'string' || (description = description.trim()).length === 0 || description.length > 255)
      throw new HttpError(400, 'Role description invalid (1-255 chars)');

    this.role_id = 0;
    this.name = name;
    this.description = description;
  }
}
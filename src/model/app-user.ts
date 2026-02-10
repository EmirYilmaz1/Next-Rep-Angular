import { HttpError } from "../helpers/errors";

export class AppUser {
  user_id: number;
  ROLE_role_id: number;
  username: string;
  email?: string;
  name: string;
  surname: string;
  registrationDate?: Date;
  userWeightKilograms?: number;
  userHeightCentimeters?: number;
  userDOB?: Date;
  userSEX?: number;

  constructor(username: string, name: string, surname: string, ROLE_role_id: number = 2) {
    if (!username || typeof username !== 'string' || (username = username.trim()).length < 3 || username.length > 45)
      throw new HttpError(400, 'Username invalid (3-45 chars)');
    if (!name || typeof name !== 'string' || (name = name.trim()).length === 0 || name.length > 45)
      throw new HttpError(400, 'Name required (1-45 chars)');
    if (!surname || typeof surname !== 'string' || (surname = surname.trim()).length === 0 || surname.length > 45)
      throw new HttpError(400, 'Surname required (1-45 chars)');
    if (typeof ROLE_role_id !== 'number' || ROLE_role_id < 0 || ROLE_role_id > 3)
      throw new HttpError(400, 'Invalid role_id (0-3)');

    this.user_id = 0;
    this.ROLE_role_id = ROLE_role_id;
    this.username = username;
    this.name = name;
    this.surname = surname;
    this.registrationDate = new Date();
  }
}

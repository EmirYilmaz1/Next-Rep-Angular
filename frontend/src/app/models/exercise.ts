export interface Exercise
{
  exercise_id: number;
  name: string;
  description: string;
  muscle_group_name: string;
  equipment_name: string | null;
  EQUIPMENT_equipment_id: number,
  MUSCLE_GROUP_id: number,
}
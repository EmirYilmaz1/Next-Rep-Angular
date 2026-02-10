export interface Person 
{
  username: string | null;
  user_id:number
  password?: string;
  email:string,
  name:string,
  
  surname:string,
  userWeightKilograms:number,
  userHeightCentimeters:number,
  roles?: number[] | null;
  role_name:string,
  ROLE_role_id: number;  
}

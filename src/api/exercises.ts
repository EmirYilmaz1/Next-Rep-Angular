import { Router, Request, Response } from "express";
import { db } from "../helpers/db";
import { Exercise } from "../model/exercise";
import { requireRole } from "../helpers/auth";
import { HttpError } from "../helpers/errors";

export const exercisesRouter = Router();

/**
 * @api {get} /exercises Get Exercises List
 * @apiName GetExercises
 * @apiGroup Exercises
 * @apiVersion 1.0.0
 * 
 * @apiDescription Retrieves a list of exercises with optional filtering by muscle group and search text.
 * 
 * @apiQuery {Number} [muscleGroup] ID of the muscle group to filter by.
 * @apiQuery {String} [q] Search term to filter by name or description.
 * 
 * @apiSuccess {Object[]} exercises List of exercise objects.
 * @apiSuccess {Number} exercises.exercise_id Exercise ID.
 * @apiSuccess {String} exercises.name Name of the exercise.
 * @apiSuccess {String} exercises.description Description of the exercise.
 * @apiSuccess {String} [exercises.equipment_name] Name of the required equipment.
 * @apiSuccess {String} exercises.muscle_group_name Name of the targeted muscle group.
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "exercise_id": 10,
 *         "name": "Bench Press",
 *         "description": "Chest exercise...",
 *         "equipment_name": "Barbell",
 *         "muscle_group_name": "Chest"
 *       }
 *     ]
 */
exercisesRouter.get('/', async (req: Request, res: Response) => {
  const { muscleGroup, q } = req.query;
  let sql = `
    SELECT 
      e.*, 
      eq.name as equipment_name,
      mg.name as muscle_group_name
    FROM exercises e 
    LEFT JOIN equipment eq ON e.EQUIPMENT_equipment_id = eq.equipment_id 
    LEFT JOIN muscle_groups mg ON e.MUSCLE_GROUP_id = mg.group_id
    WHERE 1=1 
  `;

  const params: any[] = [];

  if (muscleGroup) {
    sql += ` AND e.MUSCLE_GROUP_id = ?`;
    params.push(muscleGroup);
  }

  if (q) {
    sql += ` AND (e.name LIKE ? OR e.description LIKE ?)`;
    params.push(`%${q}%`); 
    params.push(`%${q}%`);
  }

  sql += ` ORDER BY e.name ASC`;

  try {
    const exercises = await db.connection!.all(sql, ...params);
    res.json(exercises);
  } catch (err: any) {
    throw new HttpError(500, 'Database error: ' + err.message);
  }
});


/**
 * @api {get} /exercises/:id Get Exercise Details
 * @apiName GetExerciseById
 * @apiGroup Exercises
 * @apiVersion 1.0.0
 * 
 * @apiDescription Retrieves detailed information about a specific exercise.
 * 
 * @apiParam {Number} id Exercise unique ID.
 * 
 * @apiSuccess {Object} exercise Exercise object.
 * @apiSuccess {Number} exercise.exercise_id Exercise ID.
 * @apiSuccess {String} exercise.name Name of the exercise.
 * @apiSuccess {String} [exercise.equipment_name] Name of the equipment.
 * @apiSuccess {String} exercise.muscle_group_name Name of the muscle group.
 * 
 * @apiError (404) NotFound Exercise not found.
 */
exercisesRouter.get('/:id', async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  const exercise = await db.connection!.get(`
    SELECT 
      e.*, 
      eq.name as equipment_name,
      mg.name as muscle_group_name
    FROM exercises e 
    LEFT JOIN equipment eq ON e.EQUIPMENT_equipment_id = eq.equipment_id 
    LEFT JOIN muscle_groups mg ON e.MUSCLE_GROUP_id = mg.group_id
    WHERE e.exercise_id = ?
  `, id);

  if (!exercise) throw new HttpError(404, 'Exercise not found');
  res.json(exercise);
});


/**
 * @api {post} /exercises Create Exercise
 * @apiName CreateExercise
 * @apiGroup Exercises
 * @apiVersion 1.0.0
 * 
 * @apiDescription Creates a new exercise.
 * 
 * @apiPermission Authenticated User (Role: 1 - Management)
 * 
 * @apiBody {String} name Name of the exercise (Required).
 * @apiBody {Number} MUSCLE_GROUP_id ID of the target muscle group (Required).
 * @apiBody {String} [description] Description of the exercise.
 * @apiBody {Number} [EQUIPMENT_equipment_id] ID of the required equipment (Optional).
 * 
 * @apiSuccess {Object} exercise The created exercise object.
 * 
 * @apiError (400) BadRequest Missing required fields.
 * @apiError (500) ServerError Failed to create exercise.
 */
exercisesRouter.post('/', requireRole([1]), async (req: Request, res: Response) => {
  const { EQUIPMENT_equipment_id, MUSCLE_GROUP_id, name, description } = req.body;
  
  if (!MUSCLE_GROUP_id) throw new HttpError(400, 'Muscle group ID is required');

  try {
    const result = await db.connection!.run(
      `INSERT INTO exercises (EQUIPMENT_equipment_id, MUSCLE_GROUP_id, name, description)
       VALUES (?, ?, ?, ?)`,
      EQUIPMENT_equipment_id, MUSCLE_GROUP_id, name, description
    );
    
    res.status(201).json({ 
      exercise_id: result.lastID!, 
      name, 
      MUSCLE_GROUP_id, 
      description 
    });
  } catch (err: any) {
    throw new HttpError(500, 'Cannot create exercise: ' + err.message);
  }
});


/**
 * @api {delete} /exercises/:id Delete Exercise
 * @apiName DeleteExercise
 * @apiGroup Exercises
 * @apiVersion 1.0.0
 * 
 * @apiDescription Deletes an exercise. Will fail if the exercise is used in any workout or history log.
 * 
 * @apiPermission Authenticated User (Role: 1 - Management)
 * 
 * @apiParam {Number} id Exercise unique ID.
 * 
 * @apiSuccess {String} message Confirmation message.
 * 
 * @apiError (404) NotFound Exercise not found.
 * @apiError (409) Conflict Cannot delete exercise because it is in use (Foreign Key constraint).
 */
exercisesRouter.delete('/:id', requireRole([1]), async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  const existing = await db.connection!.get('SELECT exercise_id FROM exercises WHERE exercise_id = ?', id);
  if (!existing) {
    throw new HttpError(404, 'Exercise not found');
  }

  try {
    await db.connection!.run('DELETE FROM exercises WHERE exercise_id = ?', id);
    res.json({ message: 'Exercise deleted successfully' });

  } catch (err: any) {
    if (err.message.includes('FOREIGN KEY constraint failed')) {
      throw new HttpError(409, 'Cannot delete exercise because it is part of existing workouts or history logs');
    }
    throw new HttpError(500, 'Failed to delete exercise: ' + err.message);
  }
});

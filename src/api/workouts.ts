import { Router, Request, Response } from "express";
import { db } from "../helpers/db";
import { Workout } from "../model/workout";
import { WorkoutExercise } from "../model/workout-exercise"; 
import { requireRole } from "../helpers/auth";
import { HttpError } from "../helpers/errors";

export const workoutsRouter = Router();

/**
 * @api {get} /workouts Get All Workouts
 * @apiName GetAllWorkouts
 * @apiGroup Workouts
 * @apiVersion 1.0.0
 * 
 * @apiDescription Retrieves a list of all predefined workouts.
 * 
 * @apiPermission Authenticated User (Role: 0, 1, 2, 3)
 * 
 * @apiSuccess {Object[]} workouts List of workouts.
 * @apiSuccess {Number} workouts.workout_id Workout ID.
 * @apiSuccess {String} workouts.name Name of the workout.
 * @apiSuccess {Number} workouts.type Workout type ID.
 * @apiSuccess {Number} workouts.durationMinutes Estimated duration.
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "workout_id": 1,
 *         "name": "Full Body A",
 *         "type": 1,
 *         "durationMinutes": 60
 *       }
 *     ]
 * 
 * @apiError (401) NotAuthenticated User not logged in.
 */
workoutsRouter.get('/', requireRole([0, 1, 2, 3]), async (req: Request, res: Response) => {
  const workouts = await db.connection!.all('SELECT * FROM workouts ORDER BY name');
  res.json(workouts);
});


/**
 * @api {get} /workouts/:id Get Workout Details
 * @apiName GetWorkoutById
 * @apiGroup Workouts
 * @apiVersion 1.0.0
 * 
 * @apiDescription Retrieves details of a specific workout including the list of exercises.
 * 
 * @apiParam {Number} id Workout unique ID.
 * 
 * @apiSuccess {Object} workout Workout details object.
 * @apiSuccess {Number} workout.workout_id Workout ID.
 * @apiSuccess {String} workout.name Name of the workout.
 * @apiSuccess {Object[]} workout.exercises List of exercises in this workout.
 * @apiSuccess {String} workout.exercises.name Exercise name.
 * @apiSuccess {String} workout.exercises.muscle_group_name Target muscle group.
 * @apiSuccess {Number} workout.exercises.plannedSets Planned sets.
 * @apiSuccess {Number} workout.exercises.plannedReps Planned reps.
 * 
 * @apiError (404) NotFound Workout not found.
 */
workoutsRouter.get('/:id', requireRole([0, 1, 2, 3]), async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  
  const workout = await db.connection!.get('SELECT * FROM workouts WHERE workout_id = ?', id);
  if (!workout) throw new HttpError(404, 'Workout not found');

  const exercises = await db.connection!.all(
   ` SELECT 
      we.*, 
      e.name, 
      e.description,
      mg.name as muscle_group_name
    FROM workout_exercises we
    JOIN exercises e ON we.exercise_id = e.exercise_id
    LEFT JOIN muscle_groups mg ON e.MUSCLE_GROUP_id = mg.group_id
    WHERE we.workout_id = ?
    ORDER BY we.sequence_order`
  , id);

  res.json({ ...workout, exercises });
});


/**
 * @api {post} /workouts Create Workout
 * @apiName CreateWorkout
 * @apiGroup Workouts
 * @apiVersion 1.0.0
 * 
 * @apiDescription Creates a new workout plan with associated exercises.
 * 
 * @apiPermission Authenticated User (Role: 1 - Management)
 * 
 * @apiBody {String} name Name of the workout.
 * @apiBody {String} [description] Workout description.
 * @apiBody {Number} [type] Type ID (e.g. 1 for Strength).
 * @apiBody {Number} [durationMinutes] Estimated duration.
 * @apiBody {Object[]} [exercises] Array of exercises to include.
 * @apiBody {Number} exercises.exercise_id ID of exercise.
 * @apiBody {Number} exercises.sequence_order Order in the workout (1, 2, 3...).
 * @apiBody {Number} exercises.plannedSets Target sets.
 * @apiBody {Number} exercises.plannedReps Target reps.
 * @apiBody {Number} exercises.plannedWeight Target weight.
 * 
 * @apiSuccess {Number} workout_id ID of the created workout.
 * @apiSuccess {String} message Success message.
 * 
 * @apiError (400) BadRequest Invalid input or transaction failed.
 * @apiError (500) ServerError Database error.
 */
workoutsRouter.post('/', requireRole([1]), async (req: Request, res: Response) => {
  const { name, description, type, durationMinutes, exercises } = req.body;

  await db.connection!.exec('BEGIN IMMEDIATE');

  try {
    const newWorkout = new Workout(name, description, type, durationMinutes);
    
    const result = await db.connection!.run(
      `INSERT INTO workouts (name, description, type, durationMinutes) VALUES (?, ?, ?, ?)`,
      newWorkout.name, newWorkout.description, newWorkout.type, newWorkout.durationMinutes
    );
    const newWorkoutId = result.lastID!;

    if (Array.isArray(exercises) && exercises.length > 0) {
      for (const exData of exercises) {
        const item = new WorkoutExercise(
          newWorkoutId, 
          exData.exercise_id, 
          exData.sequence_order, 
          exData.plannedSets, 
          exData.plannedReps, 
          exData.plannedWeight
        );

        await db.connection!.run(
          `INSERT INTO workout_exercises 
           (workout_id, exercise_id, sequence_order, plannedSets, plannedReps, plannedWeight)
           VALUES (?, ?, ?, ?, ?, ?)`,
          item.workout_id, item.exercise_id, item.sequence_order, 
          item.plannedSets, item.plannedReps, item.plannedWeight
        );
      }
    }

    await db.connection!.exec('COMMIT');
    
    res.status(201).json({ 
      workout_id: newWorkoutId, 
      message: 'Workout created successfully with exercises' 
    });

  } catch (err: any) {
    await db.connection!.exec('ROLLBACK');
    throw new HttpError(400, 'Failed to create workout: ' + err.message);
  }
});


/**
 * @api {delete} /workouts/:id Delete Workout
 * @apiName DeleteWorkout
 * @apiGroup Workouts
 * @apiVersion 1.0.0
 * 
 * @apiDescription Deletes a workout plan and its associated exercises links.
 * 
 * @apiPermission Authenticated User (Role: 1 - Management)
 * 
 * @apiParam {Number} id Workout unique ID.
 * 
 * @apiSuccess {String} message Confirmation message.
 * 
 * @apiError (404) NotFound Workout not found.
 * @apiError (500) ServerError Transaction failed.
 */
workoutsRouter.delete('/:id', requireRole([1]), async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);

  await db.connection!.exec('BEGIN IMMEDIATE');
  try {
    await db.connection!.run('DELETE FROM workout_exercises WHERE workout_id = ?', id);
    const result = await db.connection!.run('DELETE FROM workouts WHERE workout_id = ?', id);
    
    if (result.changes === 0) throw new HttpError(404, 'Workout not found');
    
    await db.connection!.exec('COMMIT');
    res.json({ message: `Workout ${id} deleted` });

  } catch (err: any) {
    await db.connection!.exec('ROLLBACK');
    throw new HttpError(500, 'Delete failed: ' + err.message);
  }
});

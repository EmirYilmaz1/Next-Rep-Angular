import { Router, Request, Response } from "express";
import { db } from "../helpers/db";
import { WorkoutHistory } from "../model/workout-history";
import { ExerciseLog } from "../model/exercise-log";
import { requireRole } from "../helpers/auth";
import { HttpError } from "../helpers/errors";

export const historyRouter = Router();

/**
 * @api {get} /history Get User Workout History
 * @apiName GetUserHistory
 * @apiGroup History
 * @apiVersion 1.0.0
 * 
 * @apiDescription Retrieves a list of completed workouts for the authenticated user.
 * Regular users see history only for the last 7 days. Premium/Admin users see full history.
 * 
 * @apiPermission Authenticated User (Role: 0, 1, 2, 3)
 * 
 * @apiSuccess {Object[]} history List of history records.
 * @apiSuccess {Number} history.history_id History Record ID.
 * @apiSuccess {String} history.date Date of the workout.
 * @apiSuccess {Number} history.durationMinutes Duration in minutes.
 * @apiSuccess {String} [history.workout_name] Name of the performed workout.
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "history_id": 105,
 *         "date": "2026-01-20",
 *         "durationMinutes": 60,
 *         "workout_name": "Full Body A"
 *       }
 *     ]
 * 
 * @apiError (401) NotAuthenticated User is not logged in.
 */
historyRouter.get('/', requireRole([0, 1, 2, 3]), async (req: Request, res: Response) => {
  const username = (req.user as any)?.username;
  if (!username) throw new HttpError(401, 'Not authenticated');

  const user = await db.connection!.get('SELECT user_id, ROLE_role_id as role_id FROM users WHERE username = ?', username);
  
  if (!user) throw new HttpError(404, 'User not found');

  //base query
  let sql = `
    SELECT wh.*, w.name as workout_name 
    FROM workout_history wh
    LEFT JOIN workouts w ON wh.WORKOUT_workout_id = w.workout_id
    WHERE wh.USER_user_id = ?
  `;
  
  const params: any[] = [user.user_id];

  if (user.role_id === 2) {
    sql += ` AND wh.date >= date('now', '-7 days')`;
  }

  sql += ` ORDER BY wh.date DESC`;

  const history = await db.connection!.all(sql, ...params);

  res.json(history);
});


/**
 * @api {get} /history/:id Get History Details
 * @apiName GetHistoryDetails
 * @apiGroup History
 * @apiVersion 1.0.0
 * 
 * @apiDescription Retrieves detailed logs (sets, reps, weights) for a specific workout history entry.
 * Users can only access their own history unless they are Admin.
 * 
 * @apiPermission Authenticated User (Role: 0, 1, 2, 3)
 * 
 * @apiParam {Number} id History Record ID.
 * 
 * @apiSuccess {Object} history History details object including logs.
 * @apiSuccess {Number} history.history_id History ID.
 * @apiSuccess {Object[]} history.logs List of exercise sets performed.
 * @apiSuccess {String} history.logs.exercise_name Name of the exercise.
 * @apiSuccess {Number} history.logs.weight Weight used.
 * @apiSuccess {Number} history.logs.reps Repetitions performed.
 * 
 * @apiError (404) NotFound History entry not found or access denied.
 */
historyRouter.get('/:id', requireRole([0, 1, 2, 3]), async (req: Request, res: Response) => {
  const historyId = parseInt(req.params.id, 10);
  const username = (req.user as any)?.username;
  
  const user = await db.connection!.get('SELECT user_id FROM users WHERE username = ?', username);
  
  let query = 'SELECT * FROM workout_history WHERE history_id = ?';
  const params: any[] = [historyId];

  const roles = (req.user as any)?.roles || [];
  if (!roles.includes(0)) {
     query += ' AND USER_user_id = ?';
     params.push(user.user_id);
  }

  const historyHeader = await db.connection!.get(query, ...params);
  if (!historyHeader) throw new HttpError(404, 'History not found or access denied');

  const logs = await db.connection!.all(`
    SELECT el.*, e.name as exercise_name 
    FROM exercise_log el
    JOIN exercises e ON el.EXERCISE_exercise_id = e.exercise_id
    WHERE el.WORKOUT_HISTORY_history_id = ?
    ORDER BY el.EXERCISE_exercise_id, el.set_number
  `, historyId);

  if (historyHeader.date) {
      historyHeader.date = new Date(historyHeader.date).toISOString().split('T')[0];
  }

  res.json({ ...historyHeader, logs }); 
});


/**
 * @api {post} /history Log Workout
 * @apiName LogWorkout
 * @apiGroup History
 * @apiVersion 1.0.0
 * 
 * @apiDescription Saves a completed workout session along with detailed exercise logs (sets, reps).
 * 
 * @apiPermission Authenticated User (Role: 0, 1, 2, 3)
 * 
 * @apiBody {Number} WORKOUT_workout_id ID of the workout performed.
 * @apiBody {Number} durationMinutes Duration in minutes.
 * @apiBody {String} [date] Date of workout (YYYY-MM-DD). Defaults to now.
 * @apiBody {String} [notes] User notes.
 * @apiBody {Object[]} [logs] Array of exercise logs.
 * @apiBody {Number} logs.exercise_id ID of the exercise.
 * @apiBody {Number} logs.set_number Set number (1, 2, 3...).
 * @apiBody {Number} logs.weight Weight used.
 * @apiBody {Number} logs.reps Reps performed.
 * 
 * @apiSuccess {String} message Success message.
 * @apiSuccess {Number} history_id ID of the created record.
 * 
 * @apiError (400) BadRequest Invalid data or failed transaction.
 */
historyRouter.post('/', requireRole([0, 1, 2, 3]), async (req: Request, res: Response) => {
  const username = (req.user as any)?.username;
  const { WORKOUT_workout_id, durationMinutes, notes, logs } = req.body;

  const user = await db.connection!.get('SELECT user_id FROM users WHERE username = ?', username);
  if (!user) throw new HttpError(404, 'User not found');

  await db.connection!.exec('BEGIN IMMEDIATE');

  try {
    const newHistory = new WorkoutHistory(
        user.user_id, 
        WORKOUT_workout_id || null, 
        durationMinutes,
        req.body.date,
        notes
    );

    const result = await db.connection!.run(
      `INSERT INTO workout_history (USER_user_id, WORKOUT_workout_id, date, durationMinutes, notes)
       VALUES (?, ?, ?, ?, ?)`,
      newHistory.USER_user_id, newHistory.WORKOUT_workout_id, newHistory.date, newHistory.durationMinutes, newHistory.notes
    );
    const newHistoryId = result.lastID!;

    
    if (Array.isArray(logs) && logs.length > 0) {
      for (const logData of logs) {
        
        const item = new ExerciseLog(
          newHistoryId,
          logData.exercise_id,
          logData.set_number,
          logData.weight,
          logData.reps
        );

        await db.connection!.run(
          `INSERT INTO exercise_log (WORKOUT_HISTORY_history_id, EXERCISE_exercise_id, set_number, weight, reps)
           VALUES (?, ?, ?, ?, ?)`,
          item.WORKOUT_HISTORY_history_id, item.EXERCISE_exercise_id, item.set_number, item.weight, item.reps
        );
      }
    }

    await db.connection!.exec('COMMIT');
    res.status(201).json({ message: 'Workout logged successfully', history_id: newHistoryId });

  } catch (err: any) {
    await db.connection!.exec('ROLLBACK');
    throw new HttpError(400, 'Failed to log workout: ' + err.message);
  }
});


/**
 * @api {delete} /history/:id Delete History Entry
 * @apiName DeleteHistory
 * @apiGroup History
 * @apiVersion 1.0.0
 * 
 * @apiDescription Deletes a workout history record and all associated logs.
 * 
 * @apiPermission Authenticated User (Role: 1 - Management)
 * 
 * @apiParam {Number} id History Record ID.
 * 
 * @apiSuccess {String} message Confirmation message.
 * 
 * @apiError (404) NotFound History entry not found.
 * @apiError (500) ServerError Transaction failed.
 */
historyRouter.delete('/:id', requireRole([1]), async (req: Request, res: Response) => {
    const historyId = parseInt(req.params.id, 10);
  
    const historyItem = await db.connection!.get(
      'SELECT history_id FROM workout_history WHERE history_id = ?', 
      historyId
    );
  
    if (!historyItem) {
      throw new HttpError(404, 'Workout history entry not found');
    }

    await db.connection!.exec('BEGIN IMMEDIATE');
  
    try {
      await db.connection!.run(
        'DELETE FROM exercise_log WHERE WORKOUT_HISTORY_history_id = ?', 
        historyId
      );
  
      await db.connection!.run(
        'DELETE FROM workout_history WHERE history_id = ?', 
        historyId
      );
  
      await db.connection!.exec('COMMIT');
      res.json({ message: 'Workout history entry deleted successfully' }); 
  
    } catch (err: any) {
      await db.connection!.exec('ROLLBACK');
      throw new HttpError(500, 'Failed to delete entry: ' + err.message);
    }
});

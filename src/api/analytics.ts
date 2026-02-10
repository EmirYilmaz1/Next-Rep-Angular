import { Router, Request, Response } from "express";
import { db } from "../helpers/db";
import { requireRole } from "../helpers/auth";
import { HttpError } from "../helpers/errors";

export const analyticsRouter = Router();

/**
 * @api {get} /analytics/workouts-per-day Get Workouts Per Day
 * @apiName GetWorkoutsPerDay
 * @apiGroup Analytics
 * @apiVersion 1.0.0
 * 
 * @apiDescription Retrieves aggregated count of completed workouts grouped by date.
 * Regular users see data only for the last 7 days. Premium/Admin users see full history.
 * 
 * @apiPermission Authenticated User (Role: 0, 1, 2, 3)
 * 
 * @apiSuccess {Object[]} data List of daily workout counts.
 * @apiSuccess {String} data.workout_date Date of the workout (YYYY-MM-DD).
 * @apiSuccess {Number} data.count Number of workouts completed on that date.
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       { "workout_date": "2026-01-15", "count": 1 },
 *       { "workout_date": "2026-01-17", "count": 2 }
 *     ]
 * 
 * @apiError (401) NotAuthenticated User is not logged in.
 * @apiError (404) UserNotFound User profile not found in database.
 */
analyticsRouter.get('/workouts-per-day', requireRole([0, 1, 2, 3]), async (req: Request, res: Response) => {
    const username = (req.user as any)?.username;
    if (!username) throw new HttpError(401, 'Not authenticated');

    const user = await db.connection!.get('SELECT user_id, ROLE_role_id as role_id FROM users WHERE username = ?', username);
    if (!user) throw new HttpError(404, 'User not found');

    let sql = `
        SELECT date(wh.date) as workout_date, COUNT(*) as count
        FROM workout_history wh
        WHERE wh.USER_user_id = ?
    `;
    
    const params: any[] = [user.user_id];

    if (user.role_id === 2) {
        sql += ` AND wh.date >= date('now', '-7 days')`;
    }

    sql += ` 
        GROUP BY date(wh.date)
        ORDER BY date(wh.date) ASC
    `;

    const results = await db.connection!.all(sql, ...params);
    res.json(results);
});

/**
 * @api {get} /analytics/muscle-distribution Get Muscle Group Distribution
 * @apiName GetMuscleDistribution
 * @apiGroup Analytics
 * @apiVersion 1.0.0
 * 
 * @apiDescription Retrieves aggregated stats of trained muscle groups based on exercise logs.
 * Regular users see data only for the last 7 days. Premium/Admin users see full history.
 * 
 * @apiPermission Authenticated User (Role: 0, 1, 2, 3)
 * 
 * @apiSuccess {Object[]} data List of muscle group counts.
 * @apiSuccess {String} data.name Name of the muscle group (e.g. Chest, Legs).
 * @apiSuccess {Number} data.count Total sets performed for this muscle group.
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       { "name": "Chest", "count": 45 },
 *       { "name": "Legs", "count": 30 }
 *     ]
 * 
 * @apiError (401) NotAuthenticated User is not logged in.
 */
analyticsRouter.get('/muscle-distribution', requireRole([0, 1, 2, 3]), async (req: Request, res: Response) => {
    const username = (req.user as any)?.username;
    if (!username) throw new HttpError(401, 'Not authenticated');

    const user = await db.connection!.get('SELECT user_id, ROLE_role_id as role_id FROM users WHERE username = ?', username);
    
    let sql = `
        SELECT mg.name, COUNT(*) as count
        FROM exercise_log el
        JOIN workout_history wh ON el.WORKOUT_HISTORY_history_id = wh.history_id
        JOIN exercises ex ON el.EXERCISE_exercise_id = ex.exercise_id
        JOIN muscle_groups mg ON ex.MUSCLE_GROUP_id = mg.group_id
        WHERE wh.USER_user_id = ?
    `;

    const params: any[] = [user.user_id];

    if (user.role_id === 2) {
        sql += ` AND wh.date >= date('now', '-7 days')`;
    }

    sql += ` 
        GROUP BY mg.name
        ORDER BY count DESC
    `;

    const results = await db.connection!.all(sql, ...params);
    res.json(results);
});

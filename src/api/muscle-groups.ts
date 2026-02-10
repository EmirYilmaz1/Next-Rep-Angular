import { Router, Request, Response } from "express";
import { db } from "../helpers/db";
import { requireRole } from "../helpers/auth";

export const muscleGroupsRouter = Router();

/**
 * @api {get} /muscle-groups Get Muscle Groups
 * @apiName GetMuscleGroups
 * @apiGroup MuscleGroups
 * @apiVersion 1.0.0
 * 
 * @apiDescription Retrieves a list of all muscle groups. Used for populating dropdown menus.
 * 
 * @apiSuccess {Object[]} groups List of muscle groups.
 * @apiSuccess {Number} groups.group_id Unique ID of the muscle group.
 * @apiSuccess {String} groups.name Name of the muscle group (e.g. Chest, Legs).
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       { "group_id": 1, "name": "Chest" },
 *       { "group_id": 2, "name": "Back" }
 *     ]
 */
muscleGroupsRouter.get('/', async (req: Request, res: Response) => {
  const groups = await db.connection!.all('SELECT * FROM muscle_groups ORDER BY name');
  res.json(groups);
});

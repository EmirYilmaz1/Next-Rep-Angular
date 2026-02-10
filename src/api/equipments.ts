import { Router, Request, Response } from "express";
import { db } from "../helpers/db";
import { Equipment } from "../model/equipment";
import { requireRole } from "../helpers/auth";
import { HttpError } from "../helpers/errors";

export const equipmentRouter = Router();

/**
 * @api {get} /equipment Get All Equipment
 * @apiName GetEquipment
 * @apiGroup Equipment
 * @apiVersion 1.0.0
 * 
 * @apiDescription Retrieves a list of all gym equipment sorted by name.
 * 
 * @apiPermission Authenticated User (Role: 1 - Management)
 * 
 * @apiSuccess {Object[]} equipment List of equipment items.
 * @apiSuccess {Number} equipment.equipment_id Equipment ID.
 * @apiSuccess {String} equipment.name Name of the equipment.
 * @apiSuccess {String} equipment.description Description of the equipment.
 * @apiSuccess {String} [equipment.alternatives] Alternative equipment names.
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 200 OK
 *     [
 *       {
 *         "equipment_id": 1,
 *         "name": "Barbell",
 *         "description": "A long metal bar...",
 *         "alternatives": "Dumbbell"
 *       }
 *     ]
 * 
 * @apiError (403) Forbidden User does not have Management role.
 */
equipmentRouter.get('/', requireRole([1]), async (req: Request, res: Response) => {
  const equipment = await db.connection!.all('SELECT * FROM equipment ORDER BY name');
  res.json(equipment);
});


/**
 * @api {post} /equipment Create Equipment
 * @apiName CreateEquipment
 * @apiGroup Equipment
 * @apiVersion 1.0.0
 * 
 * @apiDescription Adds a new equipment item to the database.
 * 
 * @apiPermission Authenticated User (Role: 1 - Management)
 * 
 * @apiBody {String} name Name of the equipment (Required).
 * @apiBody {String} description Description of the equipment (Required).
 * @apiBody {String} [alternatives] Comma-separated alternative equipment.
 * 
 * @apiSuccess {Object} equipment The created equipment object.
 * 
 * @apiSuccessExample {json} Success-Response:
 *     HTTP/1.1 201 Created
 *     {
 *       "equipment_id": 5,
 *       "name": "Kettlebell",
 *       "description": "A cast-iron ball with a handle",
 *       "alternatives": null
 *     }
 * 
 * @apiError (400) BadRequest Missing or invalid fields.
 * @apiError (500) ServerError Failed to create equipment.
 */
equipmentRouter.post('/', requireRole([1]), async (req: Request, res: Response) => {
  const { name, description, alternatives } = req.body;
  
  const newEquipment = new Equipment(name, description, alternatives);

  try {
    const result = await db.connection!.run(
      'INSERT INTO equipment (name, description, alternatives) VALUES (?, ?, ?)',
      newEquipment.name, newEquipment.description, newEquipment.alternatives
    );
    
    const created = await db.connection!.get('SELECT * FROM equipment WHERE equipment_id = ?', result.lastID);
    res.status(201).json(created);
  } catch (err: any) {
    throw new HttpError(500, 'Failed to create equipment: ' + err.message);
  }
});


/**
 * @api {delete} /equipment/:id Delete Equipment
 * @apiName DeleteEquipment
 * @apiGroup Equipment
 * @apiVersion 1.0.0
 * 
 * @apiDescription Deletes an equipment item by ID.
 * 
 * @apiPermission Authenticated User (Role: 1 - Management)
 * 
 * @apiParam {Number} id Equipment unique ID.
 * 
 * @apiSuccess {String} message Confirmation message.
 * 
 * @apiError (400) BadRequest Invalid ID format.
 * @apiError (404) NotFound Equipment not found.
 */
equipmentRouter.delete('/:id', requireRole([1]), async (req: Request, res: Response) => {
  const id = parseInt(req.params.id, 10);
  if (isNaN(id) || id <= 0) throw new HttpError(400, 'Invalid ID');

  const result = await db.connection!.run('DELETE FROM equipment WHERE equipment_id = ?', id);
  
  if (result.changes === 0) throw new HttpError(404, 'Equipment not found');
  
  res.json({ message: `Equipment ${id} deleted successfully` });
});

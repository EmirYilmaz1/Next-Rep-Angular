import { Router, Request, Response } from "express";
import { requireRole } from "../helpers/auth";
import { HttpError } from "../helpers/errors";
import { db as appDb } from "../helpers/db";
import { db as sysDbConnection, reloadUsers } from "../helpers/sysdb";

export const usersRouter = Router();

/**
 * @api {get} /users Get All Users
 * @apiName GetAllUsers
 * @apiGroup Users
 * @apiVersion 1.0.0
 * 
 * @apiDescription Retrieves a list of all registered users in the system.
 * 
 * @apiPermission Authenticated User (Role: 0 - Admin, 1 - Management)
 * 
 * @apiSuccess {Object[]} users List of users.
 * @apiSuccess {Number} users.user_id User ID.
 * @apiSuccess {String} users.username Username.
 * @apiSuccess {String} users.name First name.
 * @apiSuccess {String} users.surname Last name.
 * @apiSuccess {String} users.role_name Name of the assigned role.
 * 
 * @apiError (403) Forbidden Access denied.
 */
usersRouter.get('/', requireRole([0,1]), async (req: Request, res: Response) => {
  const users = await appDb.connection!.all(
    `
    SELECT u.*, r.name as role_name 
    FROM users u JOIN roles r ON u.ROLE_role_id = r.role_id 
    ORDER BY u.username
  `);
  res.json({ users });
});


/**
 * @api {get} /users/profile Get My Profile
 * @apiName GetMyProfile
 * @apiGroup Users
 * @apiVersion 1.0.0
 * 
 * @apiDescription Retrieves the profile information of the currently authenticated user.
 * 
 * @apiPermission Authenticated User (Role: 0, 1, 2, 3)
 * 
 * @apiSuccess {Number} user_id User ID.
 * @apiSuccess {String} username Username.
 * @apiSuccess {String} email Email address.
 * @apiSuccess {String} name First name.
 * @apiSuccess {String} surname Last name.
 * @apiSuccess {Number} [userWeightKilograms] Weight in kg.
 * @apiSuccess {Number} [userHeightCentimeters] Height in cm.
 * @apiSuccess {String} [userDOB] Date of Birth (YYYY-MM-DD).
 * 
 * @apiError (401) NotAuthenticated User not logged in.
 * @apiError (404) NotFound Profile not found.
 */
usersRouter.get('/profile', requireRole([0,1,2,3]), async (req: Request, res: Response) => {
  const username = (req.user as any)?.username;
  if (!username) throw new HttpError(401, 'Not authenticated');
  
  const profile = await appDb.connection!.get(` 
    SELECT u.*, r.name as role_name 
    FROM users u JOIN roles r ON u.ROLE_role_id = r.role_id 
    WHERE u.username = ?`, username
  );
  if (!profile) throw new HttpError(404, 'Profile not found');
  res.json(profile);
});


/**
 * @api {put} /users/profile Update My Profile
 * @apiName UpdateMyProfile
 * @apiGroup Users
 * @apiVersion 1.0.0
 * 
 * @apiDescription Updates the profile information of the currently authenticated user.
 * 
 * @apiPermission Authenticated User (Role: 0, 1, 2, 3)
 * 
 * @apiBody {String} [email] New email address.
 * @apiBody {Number} [userWeightKilograms] Weight in kg.
 * @apiBody {Number} [userHeightCentimeters] Height in cm.
 * @apiBody {String} [userDOB] Date of Birth (YYYY-MM-DD).
 * @apiBody {Number} [userSEX] Sex (0 or 1).
 * 
 * @apiSuccess {String} message Success message.
 * 
 * @apiError (400) BadRequest No valid fields provided.
 * @apiError (404) NotFound User profile not found.
 */
usersRouter.put('/profile', requireRole([0,1,2,3]), async (req: Request, res: Response) => {
  const username = (req.user as any)?.username;
  if (!username) throw new HttpError(401, 'Not authenticated');
  
  const updates = req.body;
  const allowed = ['email', 'userWeightKilograms', 'userHeightCentimeters', 'userDOB', 'userSEX'];
  const updateFields = allowed.filter(f => updates[f] !== undefined);
  
  if (updateFields.length === 0) throw new HttpError(400, 'No valid fields to update');
  
  const setClause = updateFields.map(f => `${f} = ?`).join(', ');
  const updateValues = updateFields.map(f => updates[f]);
  updateValues.push(username);
  
  const result = await appDb.connection!.run(`  
    UPDATE users SET ${setClause} WHERE username = ?`, 
    ...updateValues
  );
  
  if (result.changes === 0) throw new HttpError(404, 'Profile not found');
  res.json({ message: 'Profile updated successfully' });
});


/**
 * @api {put} /users/:user_id/role Change User Role
 * @apiName ChangeUserRole
 * @apiGroup Users
 * @apiVersion 1.0.0
 * 
 * @apiDescription Admin endpoint to change a user's role. Syncs changes to both App and System DB.
 * 
 * @apiPermission Admin Only (Role: 0)
 * 
 * @apiParam {Number} user_id User ID to update.
 * @apiBody {Number} ROLE_role_id New Role ID (0-3).
 * 
 * @apiSuccess {String} message Confirmation message.
 * 
 * @apiError (400) BadRequest Invalid role ID or params.
 * @apiError (404) NotFound User not found.
 */
usersRouter.put('/:user_id/role', requireRole([0]), async (req: Request, res: Response) => {
  const user_id = parseInt(req.params.user_id, 10);
  const { ROLE_role_id } = req.body;
  
  if (isNaN(user_id) || ROLE_role_id < 0 || ROLE_role_id > 3) 
    throw new HttpError(400, 'Invalid params');
  
  // App DB
  const roleExists = await appDb.connection!.get('SELECT 1 FROM roles WHERE role_id = ?', ROLE_role_id);
  if (!roleExists) throw new HttpError(400, 'Role not found');
  
  const appResult = await appDb.connection!.run(
    'UPDATE users SET ROLE_role_id = ? WHERE user_id = ?',
    ROLE_role_id, user_id
  );
  
  // Sys DB sync
  const appUser = await appDb.connection!.get('SELECT username FROM users WHERE user_id = ?', user_id);
  if (!appUser) throw new HttpError(404, 'User not found');
  
  const sysResult = await sysDbConnection.connection!.run(
    'UPDATE users SET roles = ? WHERE username = ?',
    JSON.stringify([ROLE_role_id]), appUser.username
  );
  
  reloadUsers();
  res.json({ message: `Role ${ROLE_role_id} synced` });
});

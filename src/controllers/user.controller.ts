import type { Request, Response, NextFunction } from 'express';
import { userRepo } from '../data/user.repository';
import { HttpError } from '../utils/httpErrors';
import { userService } from '../services/user.service';

export const userController = {
  async me(req: Request, res: Response, next: NextFunction) {
    try {
      const authUser = req.user;
      if (!authUser) {
        throw new HttpError(401, 'Unauthorized');
      }

      const user = await userRepo.findById(authUser.sub);
      if (!user) {
        throw new HttpError(404, 'User not found');
      }

      const { passwordHash, ...safeUser } = user;
      res.json(safeUser);
    } catch (err) {
      next(err);
    }
  },

  async listUsers(_req: Request, res: Response, next: NextFunction) {
    try {
      const result = await userRepo.getAllUsers();
      const users = result.map(({ passwordHash, ...safe }) => safe);
      res.json(users);
    } catch (err) {
      next(err);
    }
  },

  async updateUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        throw new HttpError(400, 'Invalid user id');
      }

      const { name, email, role } = req.body;

      const updated = await userService.updateUser(id, { name, email, role });
      if (!updated) {
        throw new HttpError(404, 'User not found');
      }

      res.json(updated);
    } catch (err) {
      next(err);
    }
  },

  async deleteUser(req: Request, res: Response, next: NextFunction) {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        throw new HttpError(400, 'Invalid user id');
      }

      const deleted = await userService.deleteUser(id);
      if (!deleted) {
        throw new HttpError(404, 'User not found');
      }

      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
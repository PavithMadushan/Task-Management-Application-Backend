import type { Request, Response, NextFunction } from 'express';
import { taskService } from '@services/task.service';

export const taskController = {
  async createTask(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const task = await taskService.createTask(user.sub, req.body);
      res.status(201).json(task);
    } catch (err) {
      next(err);
    }
  },

  async listTasks(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const tasks = await taskService.listTasks(user.sub, user.role, req.query);
      res.json(tasks);
    } catch (err) {
      next(err);
    }
  },

  async getTaskById(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const id = Number(req.params.id);
      const task = await taskService.getTask(id, user.sub, user.role);
      res.json(task);
    } catch (err) {
      next(err);
    }
  },

  async updateTask(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const id = Number(req.params.id);
      const task = await taskService.updateTask(id, user.sub, user.role, req.body);
      res.json(task);
    } catch (err) {
      next(err);
    }
  },

  async deleteTask(req: Request, res: Response, next: NextFunction) {
    try {
      const user = req.user!;
      const id = Number(req.params.id);
      await taskService.deleteTask(id, user.sub, user.role);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  },
};
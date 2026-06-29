import { Router } from 'express';
import { taskController } from '@controllers/task.controller';
import { requireAuth } from '@middlewares/auth.middleware';

export const taskRouter = Router();

taskRouter.use(requireAuth);

taskRouter.post('/', taskController.createTask);
taskRouter.get('/', taskController.listTasks);
taskRouter.get('/:id', taskController.getTaskById);
taskRouter.put('/:id', taskController.updateTask);
taskRouter.delete('/:id', taskController.deleteTask);
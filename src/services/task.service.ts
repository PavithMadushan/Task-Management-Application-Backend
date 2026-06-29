import { taskRepo, type TaskFilters } from '@data/task.repository';
import { HttpError } from '@utils/httpErrors';
import { TaskPriority, TaskStatus } from '@models/task.model';

export const taskService = {
  async createTask(
    userId: number,
    body: {
      title: string;
      description: string;
      priority: TaskPriority;
      status?: TaskStatus;
      dueDate: string;
      assignedTo: number;
    },
  ) {
    if (!body.title || !body.description) throw new HttpError(400, 'Missing title or description');

    const status = body.status ?? 'Open';

    const task = await taskRepo.createTask({
      title: body.title,
      description: body.description,
      priority: body.priority,
      status,
      dueDate: new Date(body.dueDate),
      createdBy: userId,
      assignedTo: body.assignedTo,
    });

    return task;
  },

  async listTasks(
    userId: number,
    role: 'Admin' | 'User',
    queryParams: any,
  ) {
    const filters: TaskFilters = {
      status: queryParams.status,
      priority: queryParams.priority,
      title: queryParams.title,
    };
    const tasks = await taskRepo.findTasks(filters, role === 'Admin', userId);
    return tasks;
  },

  async getTask(id: number, userId: number, role: 'Admin' | 'User') {
    const task = await taskRepo.findById(id);
    if (!task) throw new HttpError(404, 'Task not found');
    if (role !== 'Admin' && task.createdBy !== userId && task.assignedTo !== userId) {
      throw new HttpError(403, 'Forbidden');
    }
    return task;
  },

  async updateTask(
    id: number,
    userId: number,
    role: 'Admin' | 'User',
    body: Partial<{
      title: string;
      description: string;
      priority: TaskPriority;
      status: TaskStatus;
      dueDate: string;
      assignedTo: number;
    }>,
  ) {
    const task = await taskRepo.findById(id);
    if (!task) throw new HttpError(404, 'Task not found');
    if (role !== 'Admin' && task.createdBy !== userId) {
      throw new HttpError(403, 'Forbidden');
    }

    const updated = await taskRepo.updateTask(id, {
      title: body.title,
      description: body.description,
      priority: body.priority,
      status: body.status,
      dueDate: body.dueDate ? new Date(body.dueDate) : undefined,
      assignedTo: body.assignedTo,
      createdBy: task.createdBy,
    });
    return updated;
  },

  async deleteTask(id: number, userId: number, role: 'Admin' | 'User') {
    const task = await taskRepo.findById(id);
    if (!task) throw new HttpError(404, 'Task not found');
    if (role !== 'Admin' && task.createdBy !== userId) {
      throw new HttpError(403, 'Forbidden');
    }
    await taskRepo.deleteTask(id);
  },
};
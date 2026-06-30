"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskService = void 0;
const task_repository_1 = require("../data/task.repository");
const httpErrors_1 = require("../utils/httpErrors");
exports.taskService = {
    async createTask(userId, body) {
        if (!body.title || !body.description)
            throw new httpErrors_1.HttpError(400, 'Missing title or description');
        const status = body.status ?? 'Open';
        const task = await task_repository_1.taskRepo.createTask({
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
    async listTasks(userId, role, queryParams) {
        const filters = {
            status: queryParams.status,
            priority: queryParams.priority,
            title: queryParams.title,
        };
        const tasks = await task_repository_1.taskRepo.findTasks(filters, role === 'Admin', userId);
        return tasks;
    },
    async getTask(id, userId, role) {
        const task = await task_repository_1.taskRepo.findById(id);
        if (!task)
            throw new httpErrors_1.HttpError(404, 'Task not found');
        if (role !== 'Admin' && task.createdBy !== userId && task.assignedTo !== userId) {
            throw new httpErrors_1.HttpError(403, 'Forbidden');
        }
        return task;
    },
    async updateTask(id, userId, role, body) {
        const task = await task_repository_1.taskRepo.findById(id);
        if (!task)
            throw new httpErrors_1.HttpError(404, 'Task not found');
        if (role !== 'Admin' && task.createdBy !== userId) {
            throw new httpErrors_1.HttpError(403, 'Forbidden');
        }
        const updated = await task_repository_1.taskRepo.updateTask(id, {
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
    async deleteTask(id, userId, role) {
        const task = await task_repository_1.taskRepo.findById(id);
        if (!task)
            throw new httpErrors_1.HttpError(404, 'Task not found');
        if (role !== 'Admin' && task.createdBy !== userId) {
            throw new httpErrors_1.HttpError(403, 'Forbidden');
        }
        await task_repository_1.taskRepo.deleteTask(id);
    },
};

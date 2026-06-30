"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.taskController = void 0;
const task_service_1 = require("../services/task.service");
exports.taskController = {
    async createTask(req, res, next) {
        try {
            const user = req.user;
            const task = await task_service_1.taskService.createTask(user.sub, req.body);
            res.status(201).json(task);
        }
        catch (err) {
            next(err);
        }
    },
    async listTasks(req, res, next) {
        try {
            const user = req.user;
            const tasks = await task_service_1.taskService.listTasks(user.sub, user.role, req.query);
            res.json(tasks);
        }
        catch (err) {
            next(err);
        }
    },
    async getTaskById(req, res, next) {
        try {
            const user = req.user;
            const id = Number(req.params.id);
            const task = await task_service_1.taskService.getTask(id, user.sub, user.role);
            res.json(task);
        }
        catch (err) {
            next(err);
        }
    },
    async updateTask(req, res, next) {
        try {
            const user = req.user;
            const id = Number(req.params.id);
            const task = await task_service_1.taskService.updateTask(id, user.sub, user.role, req.body);
            res.json(task);
        }
        catch (err) {
            next(err);
        }
    },
    async deleteTask(req, res, next) {
        try {
            const user = req.user;
            const id = Number(req.params.id);
            await task_service_1.taskService.deleteTask(id, user.sub, user.role);
            res.status(204).send();
        }
        catch (err) {
            next(err);
        }
    },
};

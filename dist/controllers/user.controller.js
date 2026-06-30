"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userController = void 0;
const user_repository_1 = require("../data/user.repository");
const httpErrors_1 = require("../utils/httpErrors");
const user_service_1 = require("../services/user.service");
exports.userController = {
    async me(req, res, next) {
        try {
            const authUser = req.user;
            if (!authUser) {
                throw new httpErrors_1.HttpError(401, 'Unauthorized');
            }
            const user = await user_repository_1.userRepo.findById(authUser.sub);
            if (!user) {
                throw new httpErrors_1.HttpError(404, 'User not found');
            }
            const { passwordHash, ...safeUser } = user;
            res.json(safeUser);
        }
        catch (err) {
            next(err);
        }
    },
    async listUsers(_req, res, next) {
        try {
            const result = await user_repository_1.userRepo.getAllUsers();
            const users = result.map(({ passwordHash, ...safe }) => safe);
            res.json(users);
        }
        catch (err) {
            next(err);
        }
    },
    async updateUser(req, res, next) {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                throw new httpErrors_1.HttpError(400, 'Invalid user id');
            }
            const { name, email, role } = req.body;
            const updated = await user_service_1.userService.updateUser(id, { name, email, role });
            if (!updated) {
                throw new httpErrors_1.HttpError(404, 'User not found');
            }
            res.json(updated);
        }
        catch (err) {
            next(err);
        }
    },
    async deleteUser(req, res, next) {
        try {
            const id = Number(req.params.id);
            if (Number.isNaN(id)) {
                throw new httpErrors_1.HttpError(400, 'Invalid user id');
            }
            const deleted = await user_service_1.userService.deleteUser(id);
            if (!deleted) {
                throw new httpErrors_1.HttpError(404, 'User not found');
            }
            res.status(204).send();
        }
        catch (err) {
            next(err);
        }
    },
};

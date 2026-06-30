"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.authController = void 0;
const auth_service_1 = require("../services/auth.service");
exports.authController = {
    async register(req, res, next) {
        try {
            const { name, email, password } = req.body;
            const result = await auth_service_1.authService.register(name, email, password);
            res.status(201).json(result);
        }
        catch (err) {
            next(err);
        }
    },
    async login(req, res, next) {
        try {
            const { email, password } = req.body;
            const result = await auth_service_1.authService.login(email, password);
            res.json(result);
        }
        catch (err) {
            next(err);
        }
    },
};

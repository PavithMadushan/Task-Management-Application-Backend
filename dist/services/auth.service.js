"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const user_repository_1 = require("../data/user.repository");
const password_1 = require("../utils/password");
const httpErrors_1 = require("../utils/httpErrors");
exports.authService = {
    async register(name, email, password) {
        const existing = await user_repository_1.userRepo.findByEmail(email);
        if (existing)
            throw new httpErrors_1.HttpError(409, 'Email already in use');
        const passwordHash = await (0, password_1.hashPassword)(password);
        const user = await user_repository_1.userRepo.createUser(name, email, passwordHash, 'User');
        const token = jsonwebtoken_1.default.sign({ sub: user.id, role: user.role }, env_1.env.jwtSecret, {
            expiresIn: '1d',
        });
        return { user, token };
    },
    async login(email, password) {
        const user = await user_repository_1.userRepo.findByEmail(email);
        if (!user)
            throw new httpErrors_1.HttpError(401, 'Invalid credentials');
        const valid = await (0, password_1.comparePassword)(password, user.passwordHash);
        if (!valid)
            throw new httpErrors_1.HttpError(401, 'Invalid credentials');
        const token = jsonwebtoken_1.default.sign({ sub: user.id, role: user.role }, env_1.env.jwtSecret, {
            expiresIn: '1d',
        });
        return { user, token };
    },
};

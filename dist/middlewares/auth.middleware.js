"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.requireAdmin = exports.requireAuth = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const env_1 = require("../config/env");
const requireAuth = (req, res, next) => {
    const header = req.headers.authorization;
    if (!header?.startsWith('Bearer ')) {
        return res
            .status(401)
            .json({ error: 'Missing or invalid Authorization header' });
    }
    const token = header.slice(7);
    try {
        const decoded = jsonwebtoken_1.default.verify(token, env_1.env.jwtSecret);
        // Narrow the union type: must be an object, not a string
        if (typeof decoded !== 'object' || decoded === null) {
            return res.status(401).json({ error: 'Invalid token' });
        }
        const payload = decoded;
        // Runtime guards to ensure payload matches our expected shape
        if (typeof payload.sub !== 'number' ||
            (payload.role !== 'Admin' && payload.role !== 'User')) {
            return res.status(401).json({ error: 'Invalid token payload' });
        }
        req.user = payload;
        next();
    }
    catch {
        return res.status(401).json({ error: 'Invalid or expired token' });
    }
};
exports.requireAuth = requireAuth;
const requireAdmin = (req, res, next) => {
    if (!req.user) {
        return res.status(401).json({ error: 'Unauthorized' });
    }
    if (req.user.role !== 'Admin') {
        return res.status(403).json({ error: 'Forbidden' });
    }
    next();
};
exports.requireAdmin = requireAdmin;

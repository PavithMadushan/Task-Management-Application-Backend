"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const env_1 = require("./config/env");
const index_1 = require("./routes/index");
const error_middleware_1 = require("./middlewares/error.middleware");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// src/app.ts
app.get('/', (_req, res) => {
    res.json({ status: 'ok', message: 'Backend is running' });
});
app.use('/api', index_1.apiRouter);
app.use(error_middleware_1.errorHandler);
// Only listen locally; on Vercel, app is handled by the platform
if (process.env.NODE_ENV !== 'production') {
    app.listen(env_1.env.port, () => {
        console.log(`API running on port ${env_1.env.port}`);
    });
}
exports.default = app;

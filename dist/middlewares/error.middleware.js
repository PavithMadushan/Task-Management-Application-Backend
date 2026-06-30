"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const httpErrors_1 = require("../utils/httpErrors");
const errorHandler = (err, req, res, _next) => {
    console.error(err);
    if (err instanceof httpErrors_1.HttpError) {
        return res.status(err.statusCode).json({ error: err.message });
    }
    return res.status(500).json({ error: 'Internal server error' });
};
exports.errorHandler = errorHandler;

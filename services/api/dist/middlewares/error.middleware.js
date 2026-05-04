"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = void 0;
const zod_1 = require("zod");
const logger_1 = __importDefault(require("../utils/logger"));
const errorHandler = (err, req, res, next) => {
    // Log the error
    logger_1.default.error({
        msg: err.message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
        path: req.path,
        method: req.method,
    });
    // Handle Zod Validation Errors
    if (err instanceof zod_1.ZodError) {
        return res.status(400).json({
            success: false,
            message: 'Validation failed',
            errors: err.issues.map(e => ({
                path: e.path.join('.'),
                message: e.message
            })),
            code: 'VALIDATION_ERROR'
        });
    }
    // Handle Prisma Known Request Errors (e.g. Unique constraint)
    if (err.code?.startsWith('P')) {
        return res.status(400).json({
            success: false,
            message: 'Database operation failed',
            code: 'DB_ERROR'
        });
    }
    const status = err.status || 500;
    const message = err.message || 'Something went wrong';
    res.status(status).json({
        success: false,
        message,
        code: err.code || 'INTERNAL_SERVER_ERROR',
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack })
    });
};
exports.errorHandler = errorHandler;
//# sourceMappingURL=error.middleware.js.map
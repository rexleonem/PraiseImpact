"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const database_1 = __importDefault(require("../../config/database"));
const auth_middleware_1 = require("../../middlewares/auth.middleware");
const router = (0, express_1.Router)();
router.post('/push-token', auth_middleware_1.protect, async (req, res, next) => {
    try {
        const { token } = req.body;
        if (!token)
            return res.status(400).json({ message: 'Token is required' });
        await database_1.default.user.update({
            where: { id: req.user.userId },
            data: { pushToken: token },
        });
        res.json({ message: 'Push token saved' });
    }
    catch (error) {
        next(error);
    }
});
exports.default = router;
//# sourceMappingURL=user.routes.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginUser = exports.registerUser = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = __importDefault(require("../config/prisma"));
const token_1 = require("../utils/token");
const registerUser = async (data) => {
    const { name, email, password } = data;
    const existingUser = await prisma_1.default.user.findUnique({ where: { email } });
    if (existingUser) {
        throw new Error('User already exists');
    }
    const hashedPassword = await bcryptjs_1.default.hash(password, 10);
    const user = await prisma_1.default.user.create({
        data: {
            name,
            email,
            password_hash: hashedPassword,
        },
    });
    const token = (0, token_1.generateToken)(user.id, user.role);
    return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token };
};
exports.registerUser = registerUser;
const loginUser = async (data) => {
    const { email, password } = data;
    const user = await prisma_1.default.user.findUnique({ where: { email } });
    if (!user) {
        throw new Error('Invalid credentials');
    }
    const isMatch = await bcryptjs_1.default.compare(password, user.password_hash);
    if (!isMatch) {
        throw new Error('Invalid credentials');
    }
    const token = (0, token_1.generateToken)(user.id, user.role);
    return { user: { id: user.id, name: user.name, email: user.email, role: user.role }, token };
};
exports.loginUser = loginUser;
//# sourceMappingURL=auth.service.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserById = exports.createUser = exports.login = void 0;
const database_1 = __importDefault(require("../../config/database"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET || 'secret';
const login = async (email, password) => {
    const user = await database_1.default.user.findUnique({
        where: { email },
    });
    if (!user || !(await bcryptjs_1.default.compare(password, user.password))) {
        return null;
    }
    const token = jsonwebtoken_1.default.sign({ userId: user.id, role: user.role }, JWT_SECRET, { expiresIn: '7d' });
    const { password: _, ...userWithoutPassword } = user;
    return { user: userWithoutPassword, token };
};
exports.login = login;
const createUser = async (data) => {
    const hashedPassword = await bcryptjs_1.default.hash(data.password, 10);
    return database_1.default.user.create({
        data: {
            email: data.email,
            password: hashedPassword,
        },
    });
};
exports.createUser = createUser;
const getUserById = async (id) => {
    return database_1.default.user.findUnique({
        where: { id },
        select: { id: true, email: true, role: true, created_at: true },
    });
};
exports.getUserById = getUserById;
//# sourceMappingURL=auth.service.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateStatus = exports.getRequests = exports.createRequest = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const createRequest = async (userId, data) => {
    return await prisma_1.default.prayerRequest.create({
        data: {
            user_id: userId,
            message: data.message,
            is_anonymous: data.is_anonymous || false,
            status: 'pending',
        },
    });
};
exports.createRequest = createRequest;
const getRequests = async () => {
    return await prisma_1.default.prayerRequest.findMany({
        include: {
            user: {
                select: { name: true, email: true },
            },
        },
        orderBy: { created_at: 'desc' },
    });
};
exports.getRequests = getRequests;
const updateStatus = async (id, status) => {
    return await prisma_1.default.prayerRequest.update({
        where: { id },
        data: { status },
    });
};
exports.updateStatus = updateStatus;
//# sourceMappingURL=prayer.service.js.map
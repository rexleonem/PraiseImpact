"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteEvent = exports.updateEvent = exports.createEvent = exports.getEvents = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getEvents = async () => {
    return await prisma_1.default.event.findMany({
        orderBy: { date: 'asc' },
    });
};
exports.getEvents = getEvents;
const createEvent = async (data) => {
    return await prisma_1.default.event.create({
        data: {
            ...data,
            date: new Date(data.date),
        },
    });
};
exports.createEvent = createEvent;
const updateEvent = async (id, data) => {
    return await prisma_1.default.event.update({
        where: { id },
        data: {
            ...data,
            date: data.date ? new Date(data.date) : undefined,
        },
    });
};
exports.updateEvent = updateEvent;
const deleteEvent = async (id) => {
    return await prisma_1.default.event.delete({ where: { id } });
};
exports.deleteEvent = deleteEvent;
//# sourceMappingURL=events.service.js.map
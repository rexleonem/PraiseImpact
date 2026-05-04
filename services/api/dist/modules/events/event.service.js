"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserEvents = exports.rsvpEvent = exports.getEvents = exports.createEvent = void 0;
const database_1 = __importDefault(require("../../config/database"));
const notification_service_1 = require("../notifications/notification.service");
const createEvent = async (data) => {
    const event = await database_1.default.event.create({ data });
    await (0, notification_service_1.notifyAllUsers)("🎉 New Event: " + event.title, `Join us on ${new Date(event.event_date).toLocaleDateString()}. Tap to view details.`, { type: 'event', id: event.id });
    return event;
};
exports.createEvent = createEvent;
const getEvents = async () => {
    return database_1.default.event.findMany({
        orderBy: { event_date: 'asc' },
        include: { _count: { select: { rsvps: true } } },
    });
};
exports.getEvents = getEvents;
const rsvpEvent = async (userId, eventId) => {
    // @ts-ignore - Prisma 7 casing issue with RSVP model
    return database_1.default.rSVP.upsert({
        where: { userId_eventId: { userId, eventId } },
        update: {},
        create: { userId, eventId },
    });
};
exports.rsvpEvent = rsvpEvent;
const getUserEvents = async (userId) => {
    // @ts-ignore - Prisma 7 casing issue with RSVP model
    const rsvps = await database_1.default.rSVP.findMany({
        where: { userId },
        include: { event: true },
    });
    return rsvps.map((r) => r.event);
};
exports.getUserEvents = getUserEvents;
//# sourceMappingURL=event.service.js.map
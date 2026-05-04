"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updatePrayerStatus = exports.getAllPrayers = exports.getUserPrayers = exports.createPrayer = void 0;
const database_1 = __importDefault(require("../../config/database"));
const notification_service_1 = require("../notifications/notification.service");
const createPrayer = async (userId, content) => {
    return database_1.default.prayerRequest.create({
        data: { userId, content },
    });
};
exports.createPrayer = createPrayer;
const getUserPrayers = async (userId) => {
    return database_1.default.prayerRequest.findMany({
        where: { userId },
        orderBy: { created_at: 'desc' },
    });
};
exports.getUserPrayers = getUserPrayers;
const getAllPrayers = async () => {
    return database_1.default.prayerRequest.findMany({
        orderBy: { created_at: 'desc' },
        include: { user: { select: { email: true } } },
    });
};
exports.getAllPrayers = getAllPrayers;
const updatePrayerStatus = async (id, status) => {
    const prayer = await database_1.default.prayerRequest.update({
        where: { id },
        data: { status },
        include: { user: true },
    });
    if (prayer.user.pushToken) {
        let message = "Your prayer request status has been updated.";
        if (status === 'praying')
            message = "Someone is praying for your request! 🙏";
        if (status === 'answered')
            message = "Your prayer request has been marked as answered! ✨";
        await (0, notification_service_1.sendPushNotification)([prayer.user.pushToken], "Prayer Update", message, { type: 'prayer', id });
    }
    return prayer;
};
exports.updatePrayerStatus = updatePrayerStatus;
//# sourceMappingURL=prayer.service.js.map
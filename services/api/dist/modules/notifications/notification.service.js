"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyAllUsers = exports.sendPushNotification = void 0;
const expo_server_sdk_1 = require("expo-server-sdk");
const database_1 = __importDefault(require("../../config/database"));
const logger_1 = __importDefault(require("../../utils/logger"));
const expo = new expo_server_sdk_1.Expo();
const sendPushNotification = async (tokens, title, body, data) => {
    const messages = [];
    for (const token of tokens) {
        if (!expo_server_sdk_1.Expo.isExpoPushToken(token)) {
            logger_1.default.error(`Push token ${token} is not a valid Expo push token`);
            continue;
        }
        messages.push({
            to: token,
            sound: 'default',
            title,
            body,
            data,
        });
    }
    const chunks = expo.chunkPushNotifications(messages);
    const tickets = [];
    for (const chunk of chunks) {
        try {
            const ticketChunk = await expo.sendPushNotificationsAsync(chunk);
            tickets.push(...ticketChunk);
        }
        catch (error) {
            logger_1.default.error(error, 'Error sending push notification chunk');
        }
    }
};
exports.sendPushNotification = sendPushNotification;
const notifyAllUsers = async (title, body, data) => {
    const users = await database_1.default.user.findMany({
        where: { pushToken: { not: null } },
        select: { pushToken: true },
    });
    const tokens = users.map(u => u.pushToken);
    if (tokens.length > 0) {
        await (0, exports.sendPushNotification)(tokens, title, body, data);
    }
};
exports.notifyAllUsers = notifyAllUsers;
//# sourceMappingURL=notification.service.js.map
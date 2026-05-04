"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLiveSession = exports.getLiveSession = void 0;
const database_1 = __importDefault(require("../../config/database"));
const notification_service_1 = require("../notifications/notification.service");
const getLiveSession = async () => {
    return database_1.default.liveSession.findFirst();
};
exports.getLiveSession = getLiveSession;
const updateLiveSession = async (data) => {
    const session = await database_1.default.liveSession.findFirst();
    let result;
    if (session) {
        result = await database_1.default.liveSession.update({
            where: { id: session.id },
            data: {
                is_live: data.isLive,
                video_id: data.videoId,
                started_at: data.isLive ? new Date() : null,
            },
        });
    }
    else {
        result = await database_1.default.liveSession.create({
            data: {
                is_live: data.isLive,
                video_id: data.videoId,
                started_at: data.isLive ? new Date() : null,
            },
        });
    }
    if (data.isLive) {
        await (0, notification_service_1.notifyAllUsers)("🔴 We are LIVE!", "Join our Sunday Service now", { type: 'live' });
    }
    return result;
};
exports.updateLiveSession = updateLiveSession;
//# sourceMappingURL=live.service.js.map
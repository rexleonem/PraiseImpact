"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLiveStatus = exports.getLiveStatus = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getLiveStatus = async () => {
    return await prisma_1.default.liveSession.findFirst({
        orderBy: { started_at: 'desc' },
    });
};
exports.getLiveStatus = getLiveStatus;
const updateLiveStatus = async (data) => {
    const { is_live, youtube_video_id } = data;
    // Find active session or create new one
    let session = await prisma_1.default.liveSession.findFirst({
        where: { ended_at: null },
    });
    if (is_live) {
        if (session) {
            return await prisma_1.default.liveSession.update({
                where: { id: session.id },
                data: { youtube_video_id },
            });
        }
        else {
            return await prisma_1.default.liveSession.create({
                data: {
                    is_live: true,
                    youtube_video_id,
                    started_at: new Date(),
                },
            });
        }
    }
    else {
        if (session) {
            return await prisma_1.default.liveSession.update({
                where: { id: session.id },
                data: {
                    is_live: false,
                    ended_at: new Date(),
                },
            });
        }
    }
    return session;
};
exports.updateLiveStatus = updateLiveStatus;
//# sourceMappingURL=live.service.js.map
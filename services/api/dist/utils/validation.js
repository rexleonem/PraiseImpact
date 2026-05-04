"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventSchema = exports.prayerSchema = exports.liveSchema = exports.sermonSchema = exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email(),
    password: zod_1.z.string().min(6),
});
exports.sermonSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().min(1),
    video_url: zod_1.z.string().min(1),
    source_type: zod_1.z.enum(['YOUTUBE', 'CLOUDINARY']),
    thumbnail_url: zod_1.z.string().url().optional().or(zod_1.z.literal('')),
    duration: zod_1.z.number().min(0).optional(),
});
exports.liveSchema = zod_1.z.object({
    isLive: zod_1.z.boolean(),
    videoId: zod_1.z.string().optional(),
});
exports.prayerSchema = zod_1.z.object({
    content: zod_1.z.string().min(1).max(1000),
});
exports.eventSchema = zod_1.z.object({
    title: zod_1.z.string().min(1),
    description: zod_1.z.string().optional(),
    location: zod_1.z.string().optional(),
    event_date: zod_1.z.string().datetime(),
});
//# sourceMappingURL=validation.js.map
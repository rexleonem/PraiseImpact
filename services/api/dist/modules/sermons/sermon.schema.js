"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateSermonSchema = exports.createSermonSchema = void 0;
const zod_1 = require("zod");
exports.createSermonSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string(),
        description: zod_1.z.string(),
        video_url: zod_1.z.string().url(),
        source_type: zod_1.z.enum(['YOUTUBE', 'CLOUDINARY']),
        thumbnail_url: zod_1.z.string().url().optional(),
        duration: zod_1.z.number().int().optional(),
    }),
});
exports.updateSermonSchema = zod_1.z.object({
    body: exports.createSermonSchema.shape.body.partial(),
});
//# sourceMappingURL=sermon.schema.js.map
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLiveSchema = void 0;
const zod_1 = require("zod");
exports.updateLiveSchema = zod_1.z.object({
    body: zod_1.z.object({
        isLive: zod_1.z.boolean(),
        videoId: zod_1.z.string().optional(),
    }),
});
//# sourceMappingURL=live.schema.js.map
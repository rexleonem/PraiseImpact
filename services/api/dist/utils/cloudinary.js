"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSignedUploadSignature = void 0;
const cloudinary_1 = require("cloudinary");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
cloudinary_1.v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});
const getSignedUploadSignature = () => {
    const timestamp = Math.round((new Date()).getTime() / 1000);
    const signature = cloudinary_1.v2.utils.api_sign_request({
        timestamp: timestamp,
        folder: 'praise_impact/sermons',
    }, process.env.CLOUDINARY_API_SECRET);
    return { timestamp, signature };
};
exports.getSignedUploadSignature = getSignedUploadSignature;
exports.default = cloudinary_1.v2;
//# sourceMappingURL=cloudinary.js.map
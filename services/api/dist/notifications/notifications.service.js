"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.sendNotification = void 0;
const admin = __importStar(require("firebase-admin"));
// Initialize Firebase Admin with default credentials if available or use a service account key
// In a real production scenario, the service account JSON should be securely loaded.
// For now, we will initialize an empty app to prevent crashes, as we don't have the service account key json yet.
try {
    admin.initializeApp();
}
catch (error) {
    console.log('Firebase admin initialization error:', error);
}
const sendNotification = async (title, body, topic = 'all') => {
    try {
        const message = {
            notification: {
                title,
                body,
            },
            topic,
        };
        const response = await admin.messaging().send(message);
        console.log('Successfully sent message:', response);
        return response;
    }
    catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};
exports.sendNotification = sendNotification;
//# sourceMappingURL=notifications.service.js.map
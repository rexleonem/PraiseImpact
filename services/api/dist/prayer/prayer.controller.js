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
exports.update = exports.getAll = exports.submit = void 0;
const prayerService = __importStar(require("./prayer.service"));
const submit = async (req, res) => {
    try {
        const userId = req.user?.id || null;
        const request = await prayerService.createRequest(userId, req.body);
        res.status(201).json(request);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.submit = submit;
const getAll = async (req, res) => {
    try {
        const requests = await prayerService.getRequests();
        res.json(requests);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAll = getAll;
const update = async (req, res) => {
    try {
        const { status } = req.body;
        const request = await prayerService.updateStatus(req.params.id, status);
        res.json(request);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.update = update;
//# sourceMappingURL=prayer.controller.js.map
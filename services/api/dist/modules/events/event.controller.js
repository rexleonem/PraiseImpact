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
exports.getMyEvents = exports.rsvp = exports.getAll = exports.create = void 0;
const eventService = __importStar(require("./event.service"));
const create = async (req, res, next) => {
    try {
        const event = await eventService.createEvent(req.body);
        res.status(201).json(event);
    }
    catch (error) {
        next(error);
    }
};
exports.create = create;
const getAll = async (req, res, next) => {
    try {
        const events = await eventService.getEvents();
        res.json(events);
    }
    catch (error) {
        next(error);
    }
};
exports.getAll = getAll;
const rsvp = async (req, res, next) => {
    try {
        const rsvp = await eventService.rsvpEvent(req.user.userId, req.params.id);
        res.status(201).json(rsvp);
    }
    catch (error) {
        next(error);
    }
};
exports.rsvp = rsvp;
const getMyEvents = async (req, res, next) => {
    try {
        const events = await eventService.getUserEvents(req.user.userId);
        res.json(events);
    }
    catch (error) {
        next(error);
    }
};
exports.getMyEvents = getMyEvents;
//# sourceMappingURL=event.controller.js.map
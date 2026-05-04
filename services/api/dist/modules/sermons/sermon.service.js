"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSermon = exports.updateSermon = exports.getSermonById = exports.getSermons = exports.createSermon = void 0;
const database_1 = __importDefault(require("../../config/database"));
const notification_service_1 = require("../notifications/notification.service");
const createSermon = async (data) => {
    const sermon = await database_1.default.sermon.create({ data });
    await (0, notification_service_1.notifyAllUsers)("📖 New Sermon Available", sermon.title, { type: 'sermon', id: sermon.id });
    return sermon;
};
exports.createSermon = createSermon;
const getSermons = async (options) => {
    const { page = 1, limit = 10 } = options;
    const skip = (page - 1) * limit;
    return database_1.default.sermon.findMany({
        skip,
        take: limit,
        orderBy: { created_at: 'desc' },
    });
};
exports.getSermons = getSermons;
const getSermonById = async (id) => {
    return database_1.default.sermon.findUnique({ where: { id } });
};
exports.getSermonById = getSermonById;
const updateSermon = async (id, data) => {
    return database_1.default.sermon.update({ where: { id }, data });
};
exports.updateSermon = updateSermon;
const deleteSermon = async (id) => {
    return database_1.default.sermon.delete({ where: { id } });
};
exports.deleteSermon = deleteSermon;
//# sourceMappingURL=sermon.service.js.map
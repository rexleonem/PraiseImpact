"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSermon = exports.updateSermon = exports.createSermon = exports.getSermonById = exports.getSermons = void 0;
const prisma_1 = __importDefault(require("../config/prisma"));
const getSermons = async (filters) => {
    const { series, speaker, topic } = filters;
    const where = {};
    if (series)
        where.series = series;
    if (speaker)
        where.speaker = speaker;
    if (topic)
        where.tags = { has: topic };
    return await prisma_1.default.sermon.findMany({
        where,
        orderBy: { created_at: 'desc' },
    });
};
exports.getSermons = getSermons;
const getSermonById = async (id) => {
    return await prisma_1.default.sermon.findUnique({ where: { id } });
};
exports.getSermonById = getSermonById;
const createSermon = async (data) => {
    return await prisma_1.default.sermon.create({ data });
};
exports.createSermon = createSermon;
const updateSermon = async (id, data) => {
    return await prisma_1.default.sermon.update({
        where: { id },
        data,
    });
};
exports.updateSermon = updateSermon;
const deleteSermon = async (id) => {
    return await prisma_1.default.sermon.delete({ where: { id } });
};
exports.deleteSermon = deleteSermon;
//# sourceMappingURL=sermons.service.js.map
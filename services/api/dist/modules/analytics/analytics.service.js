"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSermonPerformance = exports.getOverviewStats = exports.logEvent = void 0;
const database_1 = __importDefault(require("../../config/database"));
const logEvent = async (data) => {
    return database_1.default.analyticsEvent.create({ data });
};
exports.logEvent = logEvent;
const getOverviewStats = async () => {
    const [totalUsers, totalViews, totalSermons, totalEvents] = await Promise.all([
        database_1.default.user.count(),
        database_1.default.analyticsEvent.count({ where: { type: 'view_sermon' } }),
        database_1.default.sermon.count(),
        database_1.default.event.count(),
    ]);
    return { totalUsers, totalViews, totalSermons, totalEvents };
};
exports.getOverviewStats = getOverviewStats;
const getSermonPerformance = async () => {
    const sermons = await database_1.default.sermon.findMany({
        select: {
            id: true,
            title: true,
        }
    });
    const performance = await Promise.all(sermons.map(async (sermon) => {
        const views = await database_1.default.analyticsEvent.count({
            where: { sermonId: sermon.id, type: 'view_sermon' }
        });
        const completions = await database_1.default.analyticsEvent.count({
            where: { sermonId: sermon.id, type: 'complete' }
        });
        return {
            id: sermon.id,
            title: sermon.title,
            views,
            completions,
            completionRate: views > 0 ? (completions / views) * 100 : 0
        };
    }));
    return performance.sort((a, b) => b.views - a.views);
};
exports.getSermonPerformance = getSermonPerformance;
//# sourceMappingURL=analytics.service.js.map
"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const sermon_routes_1 = __importDefault(require("./modules/sermons/sermon.routes"));
const live_routes_1 = __importDefault(require("./modules/live/live.routes"));
const user_routes_1 = __importDefault(require("./modules/users/user.routes"));
const prayer_routes_1 = __importDefault(require("./modules/prayers/prayer.routes"));
const event_routes_1 = __importDefault(require("./modules/events/event.routes"));
const analytics_routes_1 = __importDefault(require("./modules/analytics/analytics.routes"));
const error_middleware_1 = require("./middlewares/error.middleware");
const app = (0, express_1.default)();
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per windowMs
    message: { message: 'Too many requests, please try again later.' }
});
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(limiter);
// Routes
app.use('/auth', auth_routes_1.default);
app.use('/sermons', sermon_routes_1.default);
app.use('/live', live_routes_1.default);
app.use('/users', user_routes_1.default);
app.use('/prayers', prayer_routes_1.default);
app.use('/events', event_routes_1.default);
app.use('/analytics', analytics_routes_1.default);
// Health check
app.get('/', (req, res) => {
    res.json({ status: 'Praise Impact API is running' });
});
// Global Error Handler
app.use(error_middleware_1.errorHandler);
exports.default = app;
//# sourceMappingURL=app.js.map
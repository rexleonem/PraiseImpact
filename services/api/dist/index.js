"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const auth_routes_1 = __importDefault(require("./auth/auth.routes"));
const sermons_routes_1 = __importDefault(require("./sermons/sermons.routes"));
const live_routes_1 = __importDefault(require("./live/live.routes"));
const events_routes_1 = __importDefault(require("./events/events.routes"));
const prayer_routes_1 = __importDefault(require("./prayer/prayer.routes"));
const notifications_routes_1 = __importDefault(require("./notifications/notifications.routes"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 5000;
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use('/auth', auth_routes_1.default);
app.use('/sermons', sermons_routes_1.default);
app.use('/live', live_routes_1.default);
app.use('/events', events_routes_1.default);
app.use('/prayer', prayer_routes_1.default);
app.use('/notify', notifications_routes_1.default);
app.get('/', (req, res) => {
    res.json({ message: 'Praise Impact API is running' });
});
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map
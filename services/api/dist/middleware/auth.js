"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAdmin = exports.authenticate = void 0;
const token_1 = require("../utils/token");
const authenticate = (req, res, next) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }
    try {
        const decoded = (0, token_1.verifyToken)(token);
        req.user = decoded;
        next();
    }
    catch (error) {
        res.status(401).json({ message: 'Invalid token' });
    }
};
exports.authenticate = authenticate;
const isAdmin = (req, res, next) => {
    const user = req.user;
    if (user && user.role === 'admin') {
        next();
    }
    else {
        res.status(403).json({ message: 'Admin access required' });
    }
};
exports.isAdmin = isAdmin;
//# sourceMappingURL=auth.js.map
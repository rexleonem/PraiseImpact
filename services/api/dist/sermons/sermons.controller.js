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
exports.remove = exports.update = exports.create = exports.getOne = exports.getAll = void 0;
const sermonsService = __importStar(require("./sermons.service"));
const getAll = async (req, res) => {
    try {
        const sermons = await sermonsService.getSermons(req.query);
        res.json(sermons);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getAll = getAll;
const getOne = async (req, res) => {
    try {
        const sermon = await sermonsService.getSermonById(req.params.id);
        if (!sermon)
            return res.status(404).json({ message: 'Sermon not found' });
        res.json(sermon);
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.getOne = getOne;
const create = async (req, res) => {
    try {
        const sermon = await sermonsService.createSermon(req.body);
        res.status(201).json(sermon);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.create = create;
const update = async (req, res) => {
    try {
        const sermon = await sermonsService.updateSermon(req.params.id, req.body);
        res.json(sermon);
    }
    catch (error) {
        res.status(400).json({ message: error.message });
    }
};
exports.update = update;
const remove = async (req, res) => {
    try {
        await sermonsService.deleteSermon(req.params.id);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: error.message });
    }
};
exports.remove = remove;
//# sourceMappingURL=sermons.controller.js.map
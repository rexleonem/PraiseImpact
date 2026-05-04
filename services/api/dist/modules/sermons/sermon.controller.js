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
exports.remove = exports.update = exports.getOne = exports.getAll = exports.create = void 0;
const sermonService = __importStar(require("./sermon.service"));
const validation_1 = require("../../utils/validation");
const create = async (req, res, next) => {
    try {
        const validatedData = validation_1.sermonSchema.parse(req.body);
        const sermon = await sermonService.createSermon(validatedData);
        res.status(201).json(sermon);
    }
    catch (error) {
        next(error);
    }
};
exports.create = create;
const getAll = async (req, res, next) => {
    try {
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const sermons = await sermonService.getSermons({ page, limit });
        res.json(sermons);
    }
    catch (error) {
        next(error);
    }
};
exports.getAll = getAll;
const getOne = async (req, res, next) => {
    try {
        const sermon = await sermonService.getSermonById(req.params.id);
        if (!sermon)
            return res.status(404).json({ message: 'Sermon not found' });
        res.json(sermon);
    }
    catch (error) {
        next(error);
    }
};
exports.getOne = getOne;
const update = async (req, res, next) => {
    try {
        const validatedData = validation_1.sermonSchema.partial().parse(req.body);
        const sermon = await sermonService.updateSermon(req.params.id, validatedData);
        res.json(sermon);
    }
    catch (error) {
        next(error);
    }
};
exports.update = update;
const remove = async (req, res, next) => {
    try {
        await sermonService.deleteSermon(req.params.id);
        res.status(204).end();
    }
    catch (error) {
        next(error);
    }
};
exports.remove = remove;
//# sourceMappingURL=sermon.controller.js.map
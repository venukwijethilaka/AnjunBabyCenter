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
exports.deleteOffer = exports.updateOffer = exports.createOffer = exports.getActiveOffer = exports.getAllOffers = void 0;
const offerService = __importStar(require("../services/offer.service"));
const getAllOffers = async (req, res) => {
    try {
        const includeAll = req.query.all === 'true';
        const offers = await offerService.getAllOffers(includeAll);
        res.json(offers);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch offers' });
    }
};
exports.getAllOffers = getAllOffers;
const getActiveOffer = async (req, res) => {
    try {
        const offer = await offerService.getActiveOffer();
        if (!offer) {
            return res.status(204).send(); // No active offer found
        }
        res.json(offer);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch active offer' });
    }
};
exports.getActiveOffer = getActiveOffer;
const createOffer = async (req, res) => {
    try {
        const offer = await offerService.createOffer(req.body);
        res.status(201).json(offer);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create offer', error: error.message });
    }
};
exports.createOffer = createOffer;
const updateOffer = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id))
            return res.status(400).json({ message: 'Invalid ID' });
        const offer = await offerService.updateOffer(id, req.body);
        res.json(offer);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update offer' });
    }
};
exports.updateOffer = updateOffer;
const deleteOffer = async (req, res) => {
    try {
        const id = parseInt(req.params.id);
        if (isNaN(id))
            return res.status(400).json({ message: 'Invalid ID' });
        await offerService.deleteOffer(id);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete offer' });
    }
};
exports.deleteOffer = deleteOffer;
//# sourceMappingURL=offer.controller.js.map
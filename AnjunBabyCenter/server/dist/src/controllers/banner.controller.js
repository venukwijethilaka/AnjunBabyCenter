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
exports.deleteBanner = exports.updateBanner = exports.createBanner = exports.getBannerById = exports.getActiveBanners = exports.getBanners = void 0;
const bannerService = __importStar(require("../services/banner.service"));
const getBanners = async (req, res) => {
    try {
        const banners = await bannerService.getAllBanners();
        res.json(banners);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch banners' });
    }
};
exports.getBanners = getBanners;
const getActiveBanners = async (req, res) => {
    try {
        // FIX: Cast query to string or undefined specifically
        const position = req.query.position;
        const banners = await bannerService.getActiveBanners(position);
        res.json(banners);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch active banners' });
    }
};
exports.getActiveBanners = getActiveBanners;
const getBannerById = async (req, res) => {
    try {
        // FIX: Ensure ID is parsed as a number and handled if NaN
        const id = parseInt(req.params.id);
        if (isNaN(id))
            return res.status(400).json({ message: 'Invalid ID format' });
        const banner = await bannerService.getBannerById(id);
        if (!banner)
            return res.status(404).json({ message: 'Banner not found' });
        res.json(banner);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to fetch banner' });
    }
};
exports.getBannerById = getBannerById;
const createBanner = async (req, res) => {
    try {
        if (!req.body.imageUrl || !req.body.bannerPosition) {
            return res.status(400).json({ message: 'Image URL and position required' });
        }
        const banner = await bannerService.createBanner(req.body);
        res.status(201).json(banner);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to create banner' });
    }
};
exports.createBanner = createBanner;
const updateBanner = async (req, res) => {
    try {
        // FIX: Parse ID correctly
        const id = parseInt(req.params.id);
        if (isNaN(id))
            return res.status(400).json({ message: 'Invalid ID format' });
        const banner = await bannerService.updateBanner(id, req.body);
        res.json(banner);
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to update banner' });
    }
};
exports.updateBanner = updateBanner;
const deleteBanner = async (req, res) => {
    try {
        // FIX: Parse ID correctly
        const id = parseInt(req.params.id);
        if (isNaN(id))
            return res.status(400).json({ message: 'Invalid ID format' });
        await bannerService.deleteBanner(id);
        res.status(204).send();
    }
    catch (error) {
        res.status(500).json({ message: 'Failed to delete banner' });
    }
};
exports.deleteBanner = deleteBanner;
//# sourceMappingURL=banner.controller.js.map
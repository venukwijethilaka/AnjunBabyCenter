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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const bannerController = __importStar(require("../controllers/banner.controller"));
const imagekit_controller_1 = require("../controllers/imagekit.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
// Banner Management
router.get('/', bannerController.getBanners);
router.get('/active', bannerController.getActiveBanners);
router.get('/:id', bannerController.getBannerById);
router.post('/', auth_middleware_1.verifyToken, auth_middleware_1.requireAdmin, bannerController.createBanner);
router.patch('/:id', auth_middleware_1.verifyToken, auth_middleware_1.requireAdmin, bannerController.updateBanner);
router.delete('/:id', auth_middleware_1.verifyToken, auth_middleware_1.requireAdmin, bannerController.deleteBanner);
// ImageKit Auth (Admin Only for file uploads)
router.get('/imagekit/auth', auth_middleware_1.verifyToken, auth_middleware_1.requireAdmin, imagekit_controller_1.getAuthParams);
exports.default = router;
//# sourceMappingURL=banner.route.js.map
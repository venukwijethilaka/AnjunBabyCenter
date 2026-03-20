"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const wishlist_controller_1 = require("../controllers/wishlist.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const router = express_1.default.Router();
// Add item to wishlist
router.post("/", auth_middleware_1.verifyToken, wishlist_controller_1.addItemToWishlist);
// Get user's wishlist
router.get("/:userId", auth_middleware_1.verifyToken, wishlist_controller_1.getUserWishlist);
// Check if item is in wishlist
router.get("/:userId/:productId/status", auth_middleware_1.verifyToken, wishlist_controller_1.checkWishlistStatus);
// Remove item from wishlist by wishlistId
router.delete("/:wishlistId", auth_middleware_1.verifyToken, wishlist_controller_1.deleteWishlistItem);
// Remove item from wishlist by userId and productId
router.delete("/:userId/:productId", auth_middleware_1.verifyToken, wishlist_controller_1.deleteWishlistItemByProductAndUser);
exports.default = router;
//# sourceMappingURL=wishlist.route.js.map
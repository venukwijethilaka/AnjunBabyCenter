"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
//imports
const user_route_1 = __importDefault(require("./routes/user.route"));
const product_route_1 = __importDefault(require("./routes/product.route"));
const category_route_1 = __importDefault(require("./routes/category.route"));
const imagekit_route_1 = __importDefault(require("./routes/imagekit.route"));
const cart_route_1 = __importDefault(require("./routes/cart.route"));
const wishlist_route_1 = __importDefault(require("./routes/wishlist.route"));
const order_route_1 = __importDefault(require("./routes/order.route"));
const banner_route_1 = __importDefault(require("./routes/banner.route"));
const offer_route_1 = __importDefault(require("./routes/offer.route"));
dotenv_1.default.config();
const app = (0, express_1.default)();
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
app.use((0, morgan_1.default)("common"));
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ limit: "10mb", extended: true }));
// Trust proxy if running behind Nginx or Docker load balancer
app.set("trust proxy", 1);
// Global Ratelimit (200 requests per 15 minutes)
const globalLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 200,
    message: { message: "Too many requests from this IP, please try again after 15 minutes." }
});
app.use(globalLimiter);
// Strict Authentication Limiter 
const authLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000,
    max: 15,
    message: { message: "Too many authentication attempts, please try again later." }
});
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ["http://localhost:3000"];
app.use((0, cors_1.default)({
    origin: (origin, callback) => {
        // allow requests with no origin (like mobile apps or curl requests)
        if (!origin)
            return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1) {
            const msg = 'The CORS policy for this site does not allow access from the specified Origin.';
            return callback(new Error(msg), false);
        }
        return callback(null, true);
    },
    credentials: true
}));
// app.use(cors({
//     origin: ["http://localhost:3000"], 
//     credentials: true
// }));
// Routes
app.use("/users/auth", authLimiter);
app.use("/products", product_route_1.default);
app.use("/categories", category_route_1.default);
app.use("/users", user_route_1.default);
app.use("/imagekit", imagekit_route_1.default);
app.use("/cart", cart_route_1.default);
app.use("/wishlist", wishlist_route_1.default);
app.use("/orders", order_route_1.default);
app.use("/banners", banner_route_1.default);
app.use('/offers', offer_route_1.default);
const PORT = Number(process.env.PORT) || 8000;
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=index.js.map
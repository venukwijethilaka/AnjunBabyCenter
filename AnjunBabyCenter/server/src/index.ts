import express from 'express';
import cors from 'cors';
import bodyParser from "body-parser";
import morgan from "morgan";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";
import rateLimit from "express-rate-limit";
//imports
import userRoutes from './routes/user.route';
import productRoutes from './routes/product.route';
import categoryRoutes from './routes/category.route';
import imagekitRoutes from './routes/imagekit.route';
import cartRoutes from './routes/cart.route';
import wishlistRoutes from './routes/wishlist.route';
import orderRoutes from './routes/order.route';
import bannerRoutes from './routes/banner.route';
import offerRoutes from './routes/offer.route';
dotenv.config();

const app = express();


app.use(helmet({
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
}));
app.use(compression());
app.use(morgan("common"));
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

// Trust proxy if running behind Nginx or Docker load balancer
app.set("trust proxy", 1);

// Global Ratelimit (200 requests per 15 minutes)
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 200,
  message: { message: "Too many requests from this IP, please try again after 15 minutes." }
});
app.use(globalLimiter);

// Strict Authentication Limiter 
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 15,
  message: { message: "Too many authentication attempts, please try again later." }
});


const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(',') : ["http://localhost:3000"];
app.use(cors({
  origin: (origin, callback) => {
    // allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
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
app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/users", userRoutes);
app.use("/imagekit", imagekitRoutes);
app.use("/cart", cartRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/orders", orderRoutes);
app.use("/banners", bannerRoutes);
app.use('/offers', offerRoutes);
const PORT = Number(process.env.PORT) || 8000;

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
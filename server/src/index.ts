import express from 'express';
import cors from 'cors';
import bodyParser from "body-parser";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";
//imports
import userRoutes from './routes/user.route';
import productRoutes from './routes/product.route'; 
import categoryRoutes from './routes/category.route';
import imagekitRoutes from './routes/imagekit.route';
import cartRoutes from './routes/cart.route';
import wishlistRoutes from './routes/wishlist.route';
import orderRoutes from './routes/order.route';
import bannerRoutes from './routes/banner.route';
dotenv.config();

const app = express();


app.use(helmet());
app.use(morgan("common"));
app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ limit: "10mb", extended: true }));


app.use(cors({
  origin: true, // This allows the ngrok URL and your mobile phone to connect
  credentials: true
}));
// app.use(cors({
//     origin: ["http://localhost:3000"], 
//     credentials: true
// }));

// Routes
app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/users", userRoutes);
app.use("/imagekit", imagekitRoutes);
app.use("/cart", cartRoutes);
app.use("/wishlist", wishlistRoutes);
app.use("/orders", orderRoutes);
app.use("/banners", bannerRoutes);
const PORT = Number(process.env.PORT) || 8000;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on port ${PORT}`);
});
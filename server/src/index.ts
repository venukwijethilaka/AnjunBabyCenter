import express from 'express';
import cors from 'cors';
import bodyParser from "body-parser";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";

import userRoutes from './routes/user.route';
import productRoutes from './routes/product.route'; 
import categoryRoutes from './routes/category.route';
import imagekitRoutes from './routes/imagekit.route';

dotenv.config();

const app = express();


app.use(helmet());
app.use(morgan("common"));
app.use(express.json({ limit: "10mb" })); 
app.use(express.urlencoded({ limit: "10mb", extended: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(cors({
    origin: ["http://localhost:3000"], 
    credentials: true
}));

// Routes
app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);
app.use("/users", userRoutes);
app.use("/imagekit", imagekitRoutes);
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
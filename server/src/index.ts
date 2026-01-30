import express from 'express';
import cors from 'cors';
import bodyParser from "body-parser";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";

// Load environmental variables
dotenv.config();

// Import routes
import productRoutes from './routes/product.route.js';
import categoryRoutes from './routes/category.route.js';

const app = express();

// Middleware
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

// Routes
// Note: Since you added imagekit-auth inside productRoutes, 
// it will be at /products/imagekit-auth. 
// If you want it separate, import it from the controller here.
app.use("/products", productRoutes);
app.use("/categories", categoryRoutes);

// Server initialization
const PORT = Number(process.env.PORT) || 8000;

app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on port ${PORT}`);
});
import express from 'express';
import cors from 'cors';
import bodyParser from "body-parser";
import morgan from "morgan";
import helmet from "helmet";
import dotenv from "dotenv";

//import routes
import productRoutes from './routes/product.route.js';
import categoryRoutes from './routes/category.route.js'
//load enviromnental variables
dotenv.config();

//other configurations
const app = express();
app.use(express.json());
app.use(helmet());
app.use(morgan("common"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//routes
app.use("/products", productRoutes);
app.use("/category",categoryRoutes);
//server
const PORT = process.env.PORT || 8000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
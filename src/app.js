import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import morgan from "morgan";

import { connect } from "./config/connection.js";
import userRoutes from "./routes/user.routes.js";
import productRoutes from "./routes/product.routes.js";
import authRoutes from "./routes/auth.routes.js";
import blogRoutes from "./routes/blog.routes.js";
import categoryRoutes from "./routes/product_category.routes.js";
import blogCategoryRoutes from "./routes/blog_category.routes.js";
import brandRoutes from "./routes/brand.routes.js";
import { errorHandler, notFound } from "./middlewares/error.handler.js";

dotenv.config();

// conexão com o banco de dados
connect();

const app = express();

const PORT = process.env.PORT || 5000;

app.use(morgan("dev"));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
// app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/product", productRoutes);
app.use("/api/blog", blogRoutes);
app.use("/api/category", categoryRoutes);
app.use("/api/blog-category", blogCategoryRoutes);
app.use("/api/brand", brandRoutes);

app.use("/auth", authRoutes);

//error handler
app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running on port ${process.env.PORT}`);
});

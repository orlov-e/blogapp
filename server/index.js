import express from "express";
import cors from "cors";
import colors from "colors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import authRouter from "./routes/userRoutes.js";
import blogRouter from "./routes/blogRoutes.js";

dotenv.config({
  path: "./config/config.env",
});

const app = express();

// middlewares
app.use(cors());
app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json({ limit: "50mb", extended: true }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

// setting the routes
app.use("/", authRouter);
app.use("/blogs", blogRouter);

const PORT = process.env.PORT || 5000;

connectDB().then(() =>
  app.listen(PORT, () => {
    console.log(`server running at port ${PORT}`.bgBlue.bold);
  })
);

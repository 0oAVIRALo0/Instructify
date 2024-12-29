// Rate limiting - Done
// Schema Validation - Done
// Escaping HTML and CSS Protection
// ORM and SQL Injection
// Limiting the payload size
// HTTP response headers using helmet - Done
// Scaling Nodejs server

import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import helmet from "helmet";
import sanitize from "express-mongo-sanitize";
import xss from "xss-clean";
import { connectDB } from "./src/db/index.js";
import dotenv from "dotenv";

const app = express();
dotenv.config();
app.use(helmet());
app.use(express.json());
app.use(sanitize());
app.use(xss());
app.use(express.urlencoded({ extended: false }));
const corsOptions = {
  origin: "http://localhost:5173",
  methods: "GET,POST,PUT,DELETE",
  allowedHeaders: "Content-Type, Authorization",
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cookieParser());

const PORT = process.env.PORT || 8000;

// Routes import
import userRouter from "./src/routes/user.router.js";
import courseRouter from "./src/routes/course.router.js";
import videoRouter from "./src/routes/video.router.js";

// Routes declaration
app.use("/api/v1/user", userRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/video", videoRouter);

// Database connection and server start
connectDB()
  .then(() => {
    app.listen(PORT, (req, res) => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.log("Error connecting to the database: ", error);
  });

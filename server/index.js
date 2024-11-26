// Schema Validation using zod
// Escaping HTML and CSS Protection
// ORM and SQL Injection
// Limiting the payload size
// Authentication Limits
// HTTP response headers using helmet
// Scaling Nodejs server

import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { connectDB } from './src/db/index.js';

const app = express();
app.use(express.json());
app.use(cors(
  {
    origin: 'http://localhost:5173',
  }
))
app.use(cookieParser());

const PORT = process.env.PORT || 8000;

// Routes import
import userRouter from './src/routes/user.router.js';

// Routes declaration
app.use('/api/v1/user', userRouter);

// Database connection and server start
connectDB().then(() => { 
  app.listen(PORT, (req ,res) => { 
    console.log(`Server is running on port ${PORT}`);
  });
})
  .catch((error) => {
    console.log('Error connecting to the database: ', error);
  }
);
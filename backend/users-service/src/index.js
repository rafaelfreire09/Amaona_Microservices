import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import http from 'http';
import userRouter from './routers/userRouter.js'
import cors from 'cors';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URL);
//mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost/amazona');

app.use(cors());

app.use('/users', userRouter);

const port = process.env.PORT || 5001;

const httpServer = http.Server(app);

httpServer.listen(port, () => {
    console.log(`Serve at http://localhost:${port}`);
});
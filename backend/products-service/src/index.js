import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import http from 'http';
import path from 'path';

import productRouter from './routers/productRouter.js';
import uploadRouter from './routers/uploadRouter.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URL);
//mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost/amazona');

app.use('/products', productRouter);
app.use('/products/uploads', uploadRouter);

const __dirname = path.resolve();
app.use('/uploads', express.static(path.join(__dirname, '/uploads')));

const port = process.env.PORT || 5002;

const httpServer = http.Server(app);

httpServer.listen(port, () => {
    console.log(`Running at http://localhost:${port}`);
});
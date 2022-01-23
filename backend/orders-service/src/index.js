import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import http from 'http';
import orderRouter from './routers/orderRouter.js';
import configRouter from './routers/configRouter.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

mongoose.connect(process.env.MONGODB_URL);
//mongoose.connect(process.env.MONGODB_URL || 'mongodb://localhost/amazona');

app.use('/orders', orderRouter);
app.use('/orders/config', configRouter);

const port = process.env.PORT || 5003;

const httpServer = http.Server(app);

httpServer.listen(port, () => {
    console.log(`Serve at http://localhost:${port}`);
});
import express from 'express';
import dotenv from 'dotenv';

dotenv.config();

const configRouter = express.Router();

configRouter.get('/paypal', (req, res) => {
    res.send(process.env.PAYPAL_CLIENT_ID || 'sb');
});
configRouter.get('/google', (req, res) => {
    res.send(process.env.GOOGLE_API_KEY || '');
});

export default configRouter;
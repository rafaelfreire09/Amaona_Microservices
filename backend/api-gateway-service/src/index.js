import dotenv from 'dotenv';
import express from 'express';
import httpProxy from 'express-http-proxy';
import cors from 'cors';
dotenv.config();

const app = express();

app.use(cors())

const port = 3000

const userServiceProxy = httpProxy(process.env.USERS_API_URL);
const productsServiceProxy = httpProxy(process.env.PRODUCTS_API_URL);
const ordersServiceProxy = httpProxy(process.env.ORDERS_API_URL);

app.get('/', (req, res) => res.send('Hello Gateway API'));

app.get('/users/summary', (req, res, next) => userServiceProxy(req, res, next));
app.get('/users', (req, res, next) => userServiceProxy(req, res, next));
app.get('/users/seller', (req, res, next) => userServiceProxy(req, res, next));
app.post('/users/seed', (req, res, next) => userServiceProxy(req, res, next));
app.get('/users/top-sellers', (req, res, next) => userServiceProxy(req, res, next))
app.post('/users/register', (req, res, next) => userServiceProxy(req, res, next));
app.post('/users/signin', (req, res, next) => userServiceProxy(req, res, next));
app.put('/users/profile', (req, res, next) => userServiceProxy(req, res, next));

// Products
app.get('/products', (req, res, next) => productsServiceProxy(req, res, next));
app.get('/products/seed', (req, res, next) => productsServiceProxy(req, res, next));
app.get('/products/sumary', (req, res, next) => productsServiceProxy(req, res, next));
app.get('/products/categories', (req, res, next) => productsServiceProxy(req, res, next));
app.post('/products', (req, res, next) => productsServiceProxy(req, res, next));

// Orders
app.get('/orders', (req, res, next) => ordersServiceProxy(req, res, next));
app.get('/orders/mine', (req, res, next) => ordersServiceProxy(req, res, next));
app.post('/orders', (req, res, next) => ordersServiceProxy(req, res, next));

//:id routes
app.get('/users/:id', (req, res, next) => userServiceProxy(req, res, next));
app.put('/users/:id', (req, res, next) => userServiceProxy(req, res, next));
app.delete('/users/:id', (req, res, next) => userServiceProxy(req, res, next));

app.get('/products/:id', (req, res, next) => productsServiceProxy(req, res, next));
app.put('/products/:id', (req, res, next) => productsServiceProxy(req, res, next));
app.delete('/products/:id', (req, res, next) => productsServiceProxy(req, res, next));
app.post('/:id/reviews', (req, res, next) => productsServiceProxy(req, res, next));

app.get('orders/:id', (req, res, next) => ordersServiceProxy(req, res, next));
app.put('orders/:id/pay', (req, res, next) => ordersServiceProxy(req, res, next));
app.put('orders/:id/status', (req, res, next) => ordersServiceProxy(req, res, next));
app.put('orders/:id/deliver', (req, res, next) => ordersServiceProxy(req, res, next));
app.delete('orders/:id', (req, res, next) => ordersServiceProxy(req, res, next));

app.listen(port, () => console.log(`Example app listening on port ${port || 3000}!`));

import express from 'express';
import expressAsyncHandler from 'express-async-handler';
import { publishToQueue } from '../rabbitConfig.js';
import Order from '../models/orderModel.js';
import { isAdmin, isAuth, isSellerOrAdmin } from '../utils.js';
import axios from 'axios';

const orderRouter = express.Router();

// Create Order
orderRouter.post('/', isAuth, expressAsyncHandler(async (req, res) => {
  if (req.body.orderItems.length === 0) {
    res.status(400).send({ message: 'Cart is empty' });
  } else {
    const order = new Order({
      seller: req.body.orderItems[0].seller,
      orderItems: req.body.orderItems,
      shippingAddress: req.body.shippingAddress,
      paymentMethod: req.body.paymentMethod,
      itemsPrice: req.body.itemsPrice,
      shippingPrice: req.body.shippingPrice,
      taxPrice: req.body.taxPrice,
      totalPrice: req.body.totalPrice,
      user: req.user._id,
    });

    const createdOrder = await order.save();

    res.status(201).send({ message: 'New Order Created', order: createdOrder });
  }
}));

// Details Order
orderRouter.get('/:id', isAuth, expressAsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);

  if (order) {
    res.send(order);
  } else {
    res.status(404).send({ message: 'Order Not Found' });
  }
}));

// Pay Order
orderRouter.put('/:id/pay', isAuth, expressAsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'email name'
  );
  if (order) {
    const paymentData = {
      order,
      paymentResult: {
        id: req.body.id,
        status: req.body.status,
        update_time: req.body.update_time,
        email_address: req.body.email_address,
      }
    }

    publishToQueue("PAYMENT", { paymentData });

    res.send({ message: 'Processing payment', order });
  } else {
    res.status(404).send({ message: 'Order Not Found' });
  }
}));

// Receive Payment Status
orderRouter.put('/:id/status/:idUser', expressAsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id).populate(
    'user',
    'email name'
  );

  const data = req.body.status;
  console.log(order);
  console.log(data);

  if (data.paymentStatus === 'success') {
    order.isPaid = true;
    order.paidAt = Date.now();
    order.paymentResult = {
      id: data.paymentResult.id,
      status: data.paymentResult.status,
      update_time: data.paymentResult.update_time,
      email_address: data.paymentResult.email_address,
    };

    const updatedOrder = await order.save();
  }

  const response = await axios.get(`http://localhost:5001/users/${req.params.idUser}`);

  const user = response.data

  // Email do usuário
  const emailTo = `${user.email}`;
  // Nome do Usuário
  const userTo = `${user.name}`;
  // Título do Email
  const subjectEmail = `Status do pagamento do pedido ${order._id}`;

  let textEmail = "";

  if (data.paymentStatus === 'success') {
    // Texto do Email
    textEmail = `Pagamento aprovado!`;
  } else {
    // Texto do Email
    textEmail = `Pagamento não aprovado!`;
  }

  const email = {
    email: emailTo,
    user: userTo,
    subject: subjectEmail,
    text: textEmail
  }

  publishToQueue("EMAIL", email);
}));

// List Order Mine
orderRouter.get('/mine', isAuth, expressAsyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.send(orders);
}));

// List Orders
orderRouter.get('/', expressAsyncHandler(async (req, res) => {
  const seller = req.query.seller || '';
  const sellerFilter = seller ? { seller } : {};

  const orders = await Order.find({ ...sellerFilter }).populate(
    'user',
    'name'
  );

  res.send(orders);
}));

// Delete Order
orderRouter.delete('/:id', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    const deleteOrder = await order.remove();
    res.send({ message: 'Order Deleted', order: deleteOrder });
  } else {
    res.status(404).send({ message: 'Order Not Found' });
  }
}));

// Deliver Order
orderRouter.put('/:id/deliver', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (order) {
    order.isDelivered = true;
    order.deliveredAt = Date.now();

    const updatedOrder = await order.save();
    res.send({ message: 'Order Delivered', order: updatedOrder });
  } else {
    res.status(404).send({ message: 'Order Not Found' });
  }
}));

// Sumary Order
orderRouter.get('/summary', isAuth, isAdmin, expressAsyncHandler(async (req, res) => {
  const orders = await Order.aggregate([
    {
      $group: {
        _id: null,
        numOrders: { $sum: 1 },
        totalSales: { $sum: '$totalPrice' },
      },
    },
  ]);

  const dailyOrders = await Order.aggregate([
    {
      $group: {
        _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
        orders: { $sum: 1 },
        sales: { $sum: '$totalPrice' },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  const responseUser = await axios.get(`http://localhost:5001/users/summary`);

  const responseProduct = await axios.get(`http://localhost:5002/products/summary`);

  const users = responseUser.data.users;

  const productCategories = responseProduct.data.productCategories;

  res.send({ users, orders, dailyOrders, productCategories });
}));

export default orderRouter;

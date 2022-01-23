import express from 'express';
import expressAsyncHandler from 'express-async-handler';

import Order from '../models/orderModel.js';
import { isAdmin, isAuth, isSellerOrAdmin } from '../utils.js';
import { publishToQueue } from '../rabbitConfig.js';

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

        // publishToQueue("PAYMENT", );
        
        order.isPaid = true;
        order.paidAt = Date.now();
        order.paymentResult = {
          id: req.body.id,
          status: req.body.status,
          update_time: req.body.update_time,
          email_address: req.body.email_address,
        };

        const updatedOrder = await order.save();

        console.log("Email Enviado")
        // try {
        //     mailgun().messages().send({
        //         from: 'Amazona <amazona@mg.yourdomain.com>',
        //         to: `${order.user.name} <${order.user.email}>`,
        //         subject: `New order ${order._id}`,
        //         html: payOrderEmailTemplate(order),
        //     }, (error, body) => {
        //         if (error) {
        //             console.log(error);
        //         } else {
        //             console.log(body);
        //         }
        //     });
        // } catch (err) {
        //     console.log(err);
        // }

        res.send({ message: 'Order Paid', order: updatedOrder });
    } else {
      res.status(404).send({ message: 'Order Not Found' });
    }
}));

// List Order Mine
orderRouter.get('/mine', isAuth, expressAsyncHandler(async (req, res) => {
  const orders = await Order.find({ user: req.user._id });
  res.send(orders);
}));

// List Orders
orderRouter.get('/', isAuth, isSellerOrAdmin, expressAsyncHandler(async (req, res) => {
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
  
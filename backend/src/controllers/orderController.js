import Order from '../models/Order.js';
import Product from '../models/Product.js';
import User from '../models/User.js';
import { validationResult } from 'express-validator';

export async function list(req, res, next) {
  try {
    const user = await User.findById(req.userId).select('role').lean();
    const filter = user?.role === 'admin' ? {} : { user: req.userId };
    const orders = await Order.find(filter)
      .populate('user', 'name email')
      .populate('items.product', 'name price')
      .sort({ createdAt: -1 })
      .lean();
    res.json(orders);
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const orderDoc = await Order.findById(req.params.id).select('user');
    if (!orderDoc) return res.status(404).json({ error: 'Order not found.' });
    const currentUser = await User.findById(req.userId).select('role').lean();
    if (currentUser?.role !== 'admin' && orderDoc.user.toString() !== req.userId) {
      return res.status(404).json({ error: 'Order not found.' });
    }
    const order = await Order.findById(req.params.id)
      .populate('user', 'name email')
      .populate('items.product', 'name price images')
      .lean();
    res.json(order);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const { items, shippingAddress } = req.body;
    if (!items?.length) return res.status(400).json({ error: 'Order must have at least one item.' });

    const lineItems = [];
    let total = 0;
    for (const { productId, quantity } of items) {
      const product = await Product.findById(productId);
      if (!product) return res.status(400).json({ error: `Product not found: ${productId}` });
      if (product.stock < quantity) return res.status(400).json({ error: `Insufficient stock for ${product.name}` });
      const price = product.price;
      lineItems.push({ product: productId, quantity, price });
      total += price * quantity;
    }

    const order = await Order.create({
      user: req.userId,
      items: lineItems,
      total,
      shippingAddress: shippingAddress || {},
    });

    await Product.bulkWrite(
      lineItems.map(({ product, quantity }) => ({
        updateOne: { filter: { _id: product }, update: { $inc: { stock: -quantity } } },
      }))
    );

    const populated = await Order.findById(order._id)
      .populate('items.product', 'name price')
      .populate('user', 'name email')
      .lean();
    res.status(201).json(populated);
  } catch (err) {
    next(err);
  }
}

export async function updateStatus(req, res, next) {
  try {
    const { status } = req.body;
    const allowed = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
    if (!allowed.includes(status)) return res.status(400).json({ error: 'Invalid status.' });

    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    const user = await User.findById(req.userId).select('role').lean();
    if (user?.role !== 'admin') return res.status(403).json({ error: 'Only admin can update order status.' });

    if (status === 'cancelled' && order.status !== 'cancelled') {
      await Product.bulkWrite(
        order.items.map(({ product, quantity }) => ({
          updateOne: { filter: { _id: product }, update: { $inc: { stock: quantity } } },
        }))
      );
    }

    order.status = status;
    await order.save();
    const updated = await Order.findById(order._id)
      .populate('items.product', 'name price')
      .populate('user', 'name email')
      .lean();
    res.json(updated);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) return res.status(404).json({ error: 'Order not found.' });
    const user = await User.findById(req.userId).select('role').lean();
    if (user?.role !== 'admin') return res.status(403).json({ error: 'Only admin can delete orders.' });
    if (order.status !== 'cancelled' && order.status !== 'pending') {
      return res.status(400).json({ error: 'Only pending or cancelled orders can be deleted.' });
    }
    if (order.status === 'pending') {
      await Product.bulkWrite(
        order.items.map(({ product, quantity }) => ({
          updateOne: { filter: { _id: product }, update: { $inc: { stock: quantity } } },
        }))
      );
    }
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: 'Order deleted.' });
  } catch (err) {
    next(err);
  }
}

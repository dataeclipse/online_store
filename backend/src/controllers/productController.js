import Product from '../models/Product.js';
import Order from '../models/Order.js';
import { validationResult } from 'express-validator';

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;
const MAX_LIMIT = 100;

export async function list(req, res, next) {
  try {
    const page = Math.max(1, parseInt(req.query.page) || DEFAULT_PAGE);
    const limit = Math.min(MAX_LIMIT, Math.max(1, parseInt(req.query.limit) || DEFAULT_LIMIT));
    const skip = (page - 1) * limit;
    const category = req.query.category;
    const minPrice = req.query.minPrice != null ? parseFloat(req.query.minPrice) : null;
    const maxPrice = req.query.maxPrice != null ? parseFloat(req.query.maxPrice) : null;
    const sort = req.query.sort || '-createdAt';

    const filter = { isActive: true };
    if (category) filter.category = category;
    if (minPrice != null) filter.price = { ...filter.price, $gte: minPrice };
    if (maxPrice != null) filter.price = { ...filter.price, $lte: maxPrice };

    const [products, total] = await Promise.all([
      Product.find(filter).populate('category', 'name slug').sort(sort).skip(skip).limit(limit).lean(),
      Product.countDocuments(filter),
    ]);

    res.json({
      data: products,
      pagination: { page, limit, total, pages: Math.ceil(total / limit) },
    });
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const product = await Product.findById(req.params.id).populate('category', 'name slug').lean();
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    res.json(product);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const product = await Product.create(req.body);
    res.status(201).json(product);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const updates = {};
    const allowed = ['name', 'description', 'price', 'stock', 'category', 'images', 'isActive'];
    for (const key of allowed) {
      if (req.body[key] !== undefined) updates[key] = req.body[key];
    }
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $set: updates },
      { new: true, runValidators: true }
    );
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    res.json(product);
  } catch (err) {
    next(err);
  }
}

export async function updateStock(req, res, next) {
  try {
    const { amount } = req.body;
    if (typeof amount !== 'number') return res.status(400).json({ error: 'amount must be a number.' });
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $inc: { stock: amount } },
      { new: true }
    );
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    res.json(product);
  } catch (err) {
    next(err);
  }
}

export async function addTag(req, res, next) {
  try {
    const { tag } = req.body;
    if (!tag || typeof tag !== 'string') return res.status(400).json({ error: 'tag (string) required.' });
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $push: { tags: tag.trim() } },
      { new: true }
    );
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    res.json(product);
  } catch (err) {
    next(err);
  }
}

export async function removeTag(req, res, next) {
  try {
    const { tag } = req.body;
    if (!tag || typeof tag !== 'string') return res.status(400).json({ error: 'tag (string) required.' });
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { $pull: { tags: tag.trim() } },
      { new: true }
    );
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    res.json(product);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) return res.status(404).json({ error: 'Product not found.' });
    res.json({ message: 'Product deleted.' });
  } catch (err) {
    next(err);
  }
}

export async function stats(req, res, next) {
  try {
    const pipeline = [
      { $match: { status: { $nin: ['cancelled'] } } },
      { $unwind: '$items' },
      {
        $lookup: {
          from: 'products',
          localField: 'items.product',
          foreignField: '_id',
          as: 'productInfo',
        },
      },
      { $unwind: { path: '$productInfo', preserveNullAndEmptyArrays: true } },
      {
        $lookup: {
          from: 'categories',
          localField: 'productInfo.category',
          foreignField: '_id',
          as: 'catInfo',
        },
      },
      { $unwind: { path: '$catInfo', preserveNullAndEmptyArrays: true } },
      {
        $group: {
          _id: '$catInfo.name',
          totalQuantity: { $sum: '$items.quantity' },
          totalRevenue: { $sum: { $multiply: ['$items.quantity', '$items.price'] } },
          orderCount: { $sum: 1 },
        },
      },
      { $sort: { totalRevenue: -1 } },
      { $project: { categoryName: '$_id', totalQuantity: 1, totalRevenue: 1, orderCount: 1, _id: 0 } },
    ];

    const byCategory = await Order.aggregate(pipeline);

    const summary = await Order.aggregate([
      { $match: { status: { $nin: ['cancelled'] } } },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          totalRevenue: { $sum: '$total' },
          avgOrderValue: { $avg: '$total' },
        },
      },
      { $project: { _id: 0 } },
    ]);

    res.json({
      byCategory: byCategory || [],
      summary: summary[0] || { totalOrders: 0, totalRevenue: 0, avgOrderValue: 0 },
    });
  } catch (err) {
    next(err);
  }
}

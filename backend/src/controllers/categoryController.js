import Category from '../models/Category.js';
import Product from '../models/Product.js';
import { validationResult } from 'express-validator';

export async function list(req, res, next) {
  try {
    const categories = await Category.find().sort({ name: 1 }).lean();
    res.json(categories);
  } catch (err) {
    next(err);
  }
}

export async function getById(req, res, next) {
  try {
    const category = await Category.findById(req.params.id).lean();
    if (!category) return res.status(404).json({ error: 'Category not found.' });
    res.json(category);
  } catch (err) {
    next(err);
  }
}

export async function create(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const category = await Category.create(req.body);
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
}

export async function update(req, res, next) {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    const category = await Category.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );
    if (!category) return res.status(404).json({ error: 'Category not found.' });
    res.json(category);
  } catch (err) {
    next(err);
  }
}

export async function remove(req, res, next) {
  try {
    const categoryId = req.params.id;
    const productsCount = await Product.countDocuments({ category: categoryId });
    if (productsCount > 0) {
      return res.status(400).json({
        error: `Cannot delete category: ${productsCount} product(s) still reference it. Remove or reassign products first.`,
      });
    }
    const result = await Category.findByIdAndDelete(categoryId);
    if (!result) return res.status(404).json({ error: 'Category not found.' });
    res.json({ message: 'Category deleted.' });
  } catch (err) {
    next(err);
  }
}

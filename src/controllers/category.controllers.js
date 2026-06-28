const categoryService = require('../services/category.services');

async function createCategory(req, res, next) {
  try {
    const category = await categoryService.createCategory(req.body);
    res.status(201).json(category);
  } catch (err) {
    next(err);
  }
}

async function findAll(req, res, next) {
  try {
    const categories = await categoryService.findAll();
    res.json(categories);
  } catch (err) {
    next(err);
  }
}

async function findOne(req, res, next) {
  try {
    const category = await categoryService.findOneCategory(req.params.id);
    res.json(category);
  } catch (err) {
    next(err);
  }
}

async function updateCategory(req, res, next) {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);
    res.json(category);
  } catch (err) {
    next(err);
  }
}

async function remove(req, res, next) {
  try {
    await categoryService.softDeleteCategory(req.params.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { createCategory, findAll, findOne, updateCategory, remove };
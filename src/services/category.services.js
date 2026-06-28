const { Category } = require('../models');
const { Op } = require('sequelize');

// create category
async function createCategory({ name }) {
  const existing = await Category.findOne({ where: { name } });
  if (existing) throw Object.assign(new Error('Category already exists'), { status: 409 });

  return Category.create({ name });
}

// get all categories
async function findAll() {
  return Category.findAll({
    where: { deletedAt: null },
    order: [['name', 'ASC']],
  });
}

// get one category
async function findOneCategory(id) {
  const category = await Category.findOne({ where: { id, deletedAt: null } });
  if (!category) throw Object.assign(new Error('Category not found'), { status: 404 });
  return category;
}

// update category
async function updateCategory(id, { name }) {
  const category = await findOneCategory(id);
  return category.update({ name });
}

// soft delete
async function softDeleteCategory(id) {
  const category = await findOneCategory(id);
  return category.update({ deletedAt: new Date() });
}

module.exports = { createCategory, findAll, findOneCategory, updateCategory, softDeleteCategory };
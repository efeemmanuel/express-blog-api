const {  Post, User, Category } = require('../models');
const { Op } = require('sequelize');



async function createPost({ title, content, coverImage, isFeatured, status = 'draft', categoryIds = [] }, authorId) {
  const existingPost = await Post.findOne({ where: { title } });
  if (existingPost) throw Object.assign(new Error('Post already exists'), { status: 409 });

  const post = await Post.create({ title, content, status, coverImage, isFeatured, author_id: authorId });

  if (categoryIds.length > 0) {
    await post.setCategories(categoryIds);
  }

  return post;
}



async function findAll({ page = 1, limit = 10, search, categoryId, status } = {}) {
  const offset = (page - 1) * limit;
  const where = { deletedAt: null };

  if (status) where.status = status;
  if (search) where.title = { [Op.iLike]: `%${search}%` };

  const { count, rows } = await Post.findAndCountAll({
    where,
    include: [
      { model: User, as: 'author', attributes: ['id', 'name', 'email', 'profileImage'] },
      {
        model: Category,
        as: 'categories',
        through: { attributes: [] },
        ...(categoryId ? { where: { id: categoryId } } : {}),
      },
    ],
    limit: Number(limit),
    offset,
    order: [['createdAt', 'DESC']],
    distinct: true,
  });

  return {
    data: rows,
    meta: { total: count, page: Number(page), limit: Number(limit) },
  };
}

// get a particular post
async function findOnePost(id) {
  const post = await Post.findOne({
    where: { id, deletedAt: null },
    include: [
      { model: User, as: 'author', attributes: ['id', 'name', 'email', 'profileImage'] },
      { model: Category, as: 'categories', through: { attributes: [] } },
    ],
  });
  if (!post) throw Object.assign(new Error('Post not found'), { status: 404 });
  return post;
}

async function updatePost(id, dto, requesterId, isAdmin) {
  const post = await Post.findOne({ where: { id } });

  if (!post) throw Object.assign(new Error('Not Found'), { status: 404 });

  if (!isAdmin && post.author_id !== requesterId) {
    throw Object.assign(new Error('Forbidden'), { status: 403 });
  }

  const { categoryIds, ...rest } = dto;

  await post.update(rest);

  if (categoryIds !== undefined) {
    await post.setCategories(categoryIds);
  }

  return Post.findOne({
    where: { id },
    include: [
      { model: User, as: 'author', attributes: ['id', 'name', 'email', 'profileImage'] },
      { model: Category, as: 'categories', through: { attributes: [] } },
    ],
  });
}

// delete post 
async function softDeletePost(id, requesterId, isAdmin) {
  const post = await Post.findOne({ where: { id } });

  if (!post) {
    throw Object.assign(new Error('Not Found'), { status: 404 });
  }

  if (!isAdmin && post.author_id !== requesterId) {
    throw Object.assign(new Error('Forbidden'), { status: 403 });
  }

  return post.update({ deletedAt: new Date() });
}


module.exports = {createPost, findAll, updatePost, softDeletePost, findOnePost}
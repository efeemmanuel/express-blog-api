const {  Post, User } = require('../models');


// create post
async function createPost({title, content, status='draft'}, authorId) {

    // to check if an existing title 
    const existingPost = await Post.findOne({where : { title }});
    if (existingPost) throw Object.assign(new Error('Post already exists'), {status: 409});


    // save post to DB
    const post = await Post.create({title, content, status, author_id:authorId});

    return {title: post.title, content: post.content, status: post.status}
}




// get all post
async function findAll({ page = 1, limit = 10, search } = {}) {
  const offset = (page - 1) * limit;

  const where = { deletedAt: null };
  if (search) {
    where.title = { [Op.iLike]: `%${search}%` };
  }

  const { count, rows } = await Post.findAndCountAll({
    where,
    include: { model: User, as: 'author', attributes: ['id', 'name', 'email'] },
    limit: Number(limit),
    offset,
    order: [['createdAt', 'DESC']],
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
    include: { model: User, as: 'author', attributes: ['id', 'name', 'email'] },
  });
  if (!post) throw Object.assign(new Error('Post not found'), { status: 404 });
  return post;
}


// update post
async function updatePost(id, dto, requesterId, isAdmin) {
    const post = await Post.findOne({ where: { id } });
    
    if (!isAdmin && post.authorId !== requesterId) {
        throw Object.assign(new Error('Forbidden'), {status: 403})
    }

    return post.update(dto);
}


// delete post 
async function softDeletePost(id, requesterId, isAdmin) {
  const post = await Post.findOne({ where: { id } });

  if (!isAdmin && post.authorId !== requesterId) {
    throw Object.assign(new Error('Forbidden'), { status: 403 });
  }

  return post.update({ deletedAt: new Date() });
}


module.exports = {createPost, findAll, updatePost, softDeletePost, findOnePost}
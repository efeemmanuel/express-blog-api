const { Comment, Post, User } = require('../models');





async function createComment(id, { content }, authorId) {
  const post = await Post.findOne({ where: { id } });

  if (!post) {
    throw Object.assign(new Error('post not found'), { status: 404 });
  }

  const comment = await Comment.create({
    content,
    post_id: id,
    author_id: authorId,
  });

  const newComment = await Comment.findByPk(comment.id, {
    include: [
      {
        model: User,
        as: 'author',
        attributes: ['id', 'name', 'email'],
      },
    ],
  });

  return newComment;
}








async function findAllComment(id) {

  //  const post = await Post.findOne({
  //   where: { id, deletedAt: null },
  //   include: { model: User, as: 'author', attributes: ['id', 'name', 'email', 'profileImage'] },
  // });
    const comments = await Comment.findAll({ 
      where: { post_id: id, deletedAt: null },
      include: { model: User, as: 'author', attributes: ['id', 'name', 'email', 'profileImage'] },
    });

    if (!comments) {
        throw Object.assign(new Error('No comments found'), { status: 404 });
    }

    return comments;
}





async function softDeleteComment(id, requesterId, isAdmin) {
  const comment = await Comment.findByPk(id);

  if (!comment) {
    throw Object.assign(new Error('Comment not found'), { status: 404 });
  }

  // ownership / admin check
  if (!isAdmin && comment.author_id !== requesterId) {
    throw Object.assign(new Error('Forbidden'), { status: 403 });
  }

  // already deleted guard (optional but good)
  // if (comment.deletedAt) {
  //   return comment; // or throw error if you prefer
  // }

  return comment.update({
    deletedAt: new Date(),
  });
}


module.exports = {createComment, softDeleteComment, findAllComment}
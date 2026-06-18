const { Comment, Post, User } = require('../models');






// create comment
async function createComment(id,{content},authorId) {
    // find the post using its id
    // const post = await Post.findByPk(id)
    const post = await Post.findOne({ where: { id } });

    if (!post) {
        throw Object.assign(new Error('post not found'), {status: 404})
    }

    // create the comment with the id 
    const comment = await Comment.create({content,post_id: id ,author_id:authorId});

    return {content: comment.content}
}




async function findAllComment(id) {
    const comments = await Comment.findAll({ where: { post_id: id } });

    if (!comments) {
        throw Object.assign(new Error('No comments found'), { status: 404 });
    }

    return comments;
}



// delete comment 
async function softDeleteComment(id, requesterId, isAdmin) {
    const comment = await Comment.findByPk(id);

    if (!isAdmin && comment.author_id !== requesterId) {
        throw Object.assign(new Error('Forbidden'), { status: 403})
    }

    return comment.update({ deletedAt: new Date() });
}



module.exports = {createComment, softDeleteComment, findAllComment}
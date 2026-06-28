const postService = require('../services/post.services')
const redisClient = require('../config/redis');





async function createPost(req,res,next) {
    try {
        const post = await postService.createPost(req.body, req.user.id);
        res.status(201).json(post)
    } catch (err) {
        next(err);
    }
}





async function findAll(req, res, next) {
  let isCached = false;

  try {
    const result = await postService.findAll(req.query);
    res.json(result);
  } catch (err) {
    next(err);
  }
}




async function findOne(req, res, next) {
  try {
    const post = await postService.findOnePost(req.params.id);
    res.json(post);
  } catch (err) {
    next(err);
  }
}



async function updatePost(req, res, next) {
    try{
        const isAdmin = req.user.permissions.includes('manage_users');
        const post = await postService.updatePost(req.params.id, req.body, req.user.id, isAdmin)
        res.json(post);
    } catch (err) {
        next(err);
    }
}


async function remove(req, res, next) {
  try {
    const isAdmin = req.user.permissions.includes('manage_users');
    await postService.softDeletePost(req.params.id, req.user.id, isAdmin);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}


module.exports = {createPost, findAll, updatePost, remove, findOne}
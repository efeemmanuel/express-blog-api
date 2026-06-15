const commentService = require('../services/comment.services');




async function createComment(req,res,next) {
    try {
        const comment = await commentService.createComment(req.params.id,req.body, req.user.id);
        res.status(201).json(comment)
    } catch (err) {
        next(err)
    }
}


async function findComment(req,res,next) {
    try {
        const comment = await commentService.findAllComment(req.params.id);
        res.status(200).json(comment)
    } catch (err) {
        next(err)
    }
}


async function deleteComment(req,res,next) {
    try {
        const isAdmin = req.user.permissions.includes('manage_users')
        await commentService.softDeleteComment(req.params.id, req.user.id, isAdmin)
        res.status(204).send()
    }  catch (err) {
        next(err);
    }
}



module.exports = {createComment, findComment ,deleteComment}
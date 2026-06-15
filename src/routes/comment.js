const { Router } = require('express');
const commentController = require('../controllers/comment.controllers');
const { authenticate } = require('../middlewares/auth.middleware');
const { permit } = require('../middlewares/permission.middleware');
const rateLimiter = require('../middlewares/ratelimiter.middlware');

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     CommentInput:
 *       type: object
 *       required:
 *         - content
 *       properties:
 *         content:
 *           type: string
 *           example: This is a comment
 *
 *     Comment:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *           example: 123e4567-e89b-12d3-a456-426614174000
 *         content:
 *           type: string
 *           example: This is a comment
 *         post_id:
 *           type: string
 *           format: uuid
 *           example: 123e4567-e89b-12d3-a456-426614174000
 *         author_id:
 *           type: string
 *           format: uuid
 *           example: 123e4567-e89b-12d3-a456-426614174000
 *         createdAt:
 *           type: string
 *           format: date-time
 */

/**
 * @swagger
 * tags:
 *   name: Comments
 *   description: Comment management endpoints
 */

/**
 * @swagger
 * /comments/{postId}/comment:
 *   post:
 *     summary: Create a comment on a post
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Post ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CommentInput'
 *     responses:
 *       201:
 *         description: Comment created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Comment'
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Post not found
 */
router.post('/:postId/comment', rateLimiter,authenticate, permit('create_comment'), commentController.createComment);

/**
 * @swagger
 * /comments/{postId}/comments:
 *   get:
 *     summary: Get all comments for a post
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: postId
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Post ID
 *     responses:
 *       200:
 *         description: List of comments
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Comment'
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Post not found
 */
router.get('/:postId/comments', rateLimiter, authenticate, commentController.findComment);

/**
 * @swagger
 * /comments/{id}:
 *   delete:
 *     summary: Delete a comment
 *     tags: [Comments]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Comment ID
 *     responses:
 *       204:
 *         description: Comment deleted successfully
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Comment not found
 */
router.delete('/:id', rateLimiter, authenticate, permit('delete_comment'), commentController.deleteComment);



module.exports = router;
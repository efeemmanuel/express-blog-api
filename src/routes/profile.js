const { Router } = require('express');
const profileController = require('../controllers/profile.controllers');
const { authenticate } = require('../middlewares/auth.middleware');
const rateLimiter = require('../middlewares/ratelimiter.middlware');

const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     ProfileInput:
 *       type: object
 *       properties:
 *         name:
 *           type: string
 *           example: John Doe
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: secret123
 */

/**
 * @swagger
 * tags:
 *   name: Profile
 *   description: Profile management endpoints
 */

/**
 * @swagger
 * /profile/{id}:
 *   patch:
 *     summary: Update your profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ProfileInput'
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Profile not found
 */
router.patch('/:id', rateLimiter, authenticate ,profileController.updateProfile);

/**
 * @swagger
 * /profile/{id}:
 *   delete:
 *     summary: Delete your profile
 *     tags: [Profile]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: User ID
 *     responses:
 *       204:
 *         description: Profile deleted successfully
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Profile not found
 */
router.delete('/:id', rateLimiter, authenticate, profileController.deleteProfile);

module.exports = router;
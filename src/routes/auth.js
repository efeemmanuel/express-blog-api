const { Router } = require('express');
const authController = require('../controllers/auth.controllers.js');
const { authenticate } = require('../middlewares/auth.middleware');
const { permit } = require('../middlewares/permission.middleware');
const upload = require('../middlewares/upload');


const router = Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     Role:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *           example: editor
 *
 *     Permission:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *           format: uuid
 *         name:
 *           type: string
 *           example: create_post
 *
 *     RegisterInput:
 *       type: object
 *       required:
 *         - name
 *         - email
 *         - password
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
 *         roleName:
 *           type: string
 *           example: user
 *
 *     LoginInput:
 *       type: object
 *       required:
 *         - email
 *         - password
 *       properties:
 *         email:
 *           type: string
 *           format: email
 *           example: john@example.com
 *         password:
 *           type: string
 *           format: password
 *           example: secret123
 *
 *     AuthResponse:
 *       type: object
 *       properties:
 *         accessToken:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *         refreshToken:
 *           type: string
 *           example: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *
 * tags:
 *   - name: Auth
 *     description: Authentication endpoints
 *   - name: Roles
 *     description: Role management
 *   - name: Permissions
 *     description: Permission management
 */






/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RegisterInput'
 *     responses:
 *       201:
 *         description: User registered successfully
 *       409:
 *         description: Email already in use
 */

router.post('/register', upload.single('profileImage'), authController.register);


/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login a user
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/LoginInput'
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/AuthResponse'
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', authController.login);


/**
 * @swagger
 * /auth/refresh:
 *   post:
 *     summary: Refresh access token
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - refreshToken
 *             properties:
 *               refreshToken:
 *                 type: string
 *     responses:
 *       200:
 *         description: New access token generated
 *       401:
 *         description: Invalid or expired refresh token
 */
router.post('/refresh', authController.refresh);


/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Logout a user
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       204:
 *         description: Logged out successfully
 *       401:
 *         description: Missing or invalid token
 */
router.post('/logout', authenticate, authController.logout);


// roles

/**
 * @swagger
 * /auth/role:
 *   post:
 *     summary: Create a new role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: editor
 *     responses:
 *       200:
 *         description: Role created successfully
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Role already exists
 */
router.post('/role', authenticate, permit('manage_users'), authController.createRole);


/**
 * @swagger
 * /auth/roles:
 *   get:
 *     summary: Get all roles
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of roles
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Role'
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden
 */
router.get('/roles', authenticate, permit('manage_users'), authController.findAllRoles);


/**
 * @swagger
 * /auth/roles/{id}:
 *   delete:
 *     summary: Soft delete a role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Role ID
 *     responses:
 *       200:
 *         description: Role deleted successfully
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Role not found
 */
router.delete('/roles/:id', authenticate, permit('manage_users'), authController.deleteRole);


/**
 * @swagger
 * /auth/{id}/role:
 *   patch:
 *     summary: Assign a role to a user
 *     tags: [Roles]
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
 *             type: object
 *             required:
 *               - roleName
 *             properties:
 *               roleName:
 *                 type: string
 *                 example: editor
 *     responses:
 *       200:
 *         description: Role assigned successfully
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden
 *       404:
 *         description: User or role not found
 */
router.patch('/:id/role', authenticate, permit('manage_users'), authController.updateUserRole);



router.get('/me', authenticate, authController.currentUser);





//permissions 

/**
 * @swagger
 * /auth/permissions:
 *   post:
 *     summary: Create a new permission
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *                 example: create_post
 *     responses:
 *       201:
 *         description: Permission created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Permission'
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden
 *       409:
 *         description: Permission already exists
 */
router.post('/permissions', authenticate, permit('manage_users'), authController.createPermission);


/**
 * @swagger
 * /auth/permissions:
 *   get:
 *     summary: Get all permissions
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Permission'
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden
 */
router.get('/permissions', authenticate, permit('manage_users'), authController.findAllPermissions);


/**
 * @swagger
 * /auth/permissions/{id}:
 *   delete:
 *     summary: Soft delete a permission
 *     tags: [Permissions]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Permission ID
 *     responses:
 *       200:
 *         description: Permission deleted successfully
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Permission not found
 */
router.delete('/permissions/:id', authenticate, permit('manage_users'), authController.deletePermission);



/**
 * @swagger
 * /auth/roles/{id}/permissions:
 *   post:
 *     summary: Assign a permission to a role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Role ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - permissionId
 *             properties:
 *               permissionId:
 *                 type: string
 *                 format: uuid
 *                 example: b3f1c2d4-...
 *     responses:
 *       200:
 *         description: Permission assigned successfully
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Role or permission not found
 *   delete:
 *     summary: Remove a permission from a role
 *     tags: [Roles]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *           format: uuid
 *         description: Role ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - permissionId
 *             properties:
 *               permissionId:
 *                 type: string
 *                 format: uuid
 *                 example: b3f1c2d4-...
 *     responses:
 *       200:
 *         description: Permission removed successfully
 *       401:
 *         description: Missing or invalid token
 *       403:
 *         description: Forbidden
 *       404:
 *         description: Role or permission not found
 */
router.post('/roles/:id/permissions', authenticate, permit('manage_users'), authController.assignPermissionToRole);
router.delete('/roles/:id/permissions', authenticate, permit('manage_users'), authController.removePermissionFromRole);


module.exports = router;
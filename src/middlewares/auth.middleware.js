const { verifyAccessToken } = require('../utils/jwt');
const { User, Role, Permission } = require('../models');

async function authenticate(req, res, next) {

  // extract the token
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Missing token' });
  }

  const token = authHeader.split(' ')[1];


  // verify and decode te token
  try {
    const decoded = verifyAccessToken(token);

    // get the user from db
    const user = await User.findByPk(decoded.sub, {
      include: {
        model: Role,
        include: [Permission],
      },
    });

    if (!user) return res.status(401).json({ message: 'User not found' });


    // collect all permission names from all roles, remove duplicates, store as array
    const permissions = [
      ...new Set(
        user.Roles.flatMap((role) => role.Permissions.map((p) => p.name))
      ),
    ];

    // attach logged in user's id, email and permissions to the request so controllers can access it
    req.user = { id: user.id, email: user.email, permissions };

    // move on to the next controller
    next();
  } catch {
    return res.status(401).json({ message: 'Invalid or expired token' });
  }
}

module.exports = { authenticate };
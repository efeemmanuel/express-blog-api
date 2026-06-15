const permit = (...required) => {
  return (req, res, next) => {
    const userPermissions = req.user?.permissions ?? [];
    const allowed = required.some((p) => userPermissions.includes(p));

    if (!allowed) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    next();
  };
};

module.exports = { permit };
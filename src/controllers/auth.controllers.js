const authService = require('../services/auth.services.js');

async function register(req, res, next) {
  try {
    const user = await authService.register(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}



async function updateUserRole(req, res, next) {
    try{
        const isAdmin = req.user.permissions.includes('manage_users');
        const user = await authService.assignRole(req.params.id, req.body, req.user.id)
        res.json(user);
    } catch (err) {
        next(err);
    }
}


async function login(req, res, next) {
  try {
    const tokens = await authService.login(req.body);
    res.json(tokens);
  } catch (err) {
    next(err);
  }
}

async function refresh(req, res, next) {
  try {
    const { refreshToken } = req.body;
    if (!refreshToken) return res.status(400).json({ message: 'refreshToken required' });

    const tokens = await authService.refresh(refreshToken);
    res.json(tokens);
  } catch (err) {
    next(err);
  }
}

async function logout(req, res, next) {
  try {
    await authService.logout(req.user.id);
    res.status(204).send();
  } catch (err) {
    next(err);
  }
}

module.exports = { register, updateUserRole ,login, refresh, logout };
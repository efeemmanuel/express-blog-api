const authService = require('../services/auth.services.js');

async function register(req, res, next) {
  try {
    const user = await authService.register(req.body);
    res.status(201).json(user);
  } catch (err) {
    next(err);
  }
}



async function createRole(req,res,next) {
  try {
    const role = await authService.createRole(req.body)
    res.json(role);
  } catch (err) {
    next(err)
  }
}



async function findAllRoles(req,res,next) {
  try {
    const role = await authService.findAllRoles()
    res.json(role);
  } catch (err) {
    next(err)
  }
}



async function deleteRole(req, res, next) {
  try {
    const result = await authService.deleteRole(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}




// permissions
async function createPermission(req, res, next) {
  try {
    const permission = await authService.createPermission(req.body);
    res.status(201).json(permission);
  } catch (err) {
    next(err);
  }
}

async function findAllPermissions(req, res, next) {
  try {
    const permissions = await authService.findAllPermissions();
    res.json(permissions);
  } catch (err) {
    next(err);
  }
}

async function deletePermission(req, res, next) {
  try {
    const result = await authService.deletePermission(req.params.id);
    res.json(result);
  } catch (err) {
    next(err);
  }
}



// permissoion to roles
async function assignPermissionToRole(req, res, next) {
  try {
    const result = await authService.assignPermissionToRole(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}

async function removePermissionFromRole(req, res, next) {
  try {
    const result = await authService.removePermissionFromRole(req.params.id, req.body);
    res.json(result);
  } catch (err) {
    next(err);
  }
}










async function updateUserRole(req, res, next) {
    try{
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

module.exports = { register, updateUserRole, createRole,deleteRole,createPermission, findAllPermissions, deletePermission, assignPermissionToRole, removePermissionFromRole ,findAllRoles ,login, refresh, logout };
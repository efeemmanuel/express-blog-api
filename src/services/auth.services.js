const { User, Role, Permission } = require('../models');
const { hash, compare } = require('../utils/hash');
const { generateAccessToken, generateRefreshToken, verifyAccessToken , verifyRefreshToken } = require('../utils/jwt');



// create user
async function register({name, email, password, roleName='user'}) {
    // edge case: check if email exisits
    const existing = await User.findOne({where : { email } });
    if (existing) throw Object.assign(new Error('Email already in use'), {status: 409});

    // hash password
    const hashed = await hash(password);
    // save the user to DB
    const user = await User.create({ name, email, password: hashed });


    // check for roleName in Role models if it exists
    const role = await Role.findOne({ where: { name: roleName } });
    if (role) await user.addRole(role);

    // return the data saved
    return { id: user.id, name: user.name, email: user.email };

}


// RBAC
// create roles manually
// create permissions
// assign roles to users (editor/admin)
// assign permssions manually to users 




// create role 
async function createRole({name}) {
  
  // check if role exists already
  const existing = await Role.findOne({ where: { name }}); 
  if (existing) throw Object.assign(new Error('Role already exists!'), {status: 409});


  // save the role to DB
  const role = await Role.create({name});

  return `${name} added successfully`
}


// get all roles
async function findAllRoles() {
  const roles = await Role.findAll();

  if (!roles) {
    throw Object.assign(new Error('Roles not found'), {status: 404})
  };

  return roles
}

// delete a role
async function deleteRole(id) {
  const role = await Role.findOne({ where: { id } });

  if (!role) {
    throw Object.assign(new Error('Role not found'), { status: 404 });
  }


  await role.update({ deletedAt: new Date() });

  return { message: 'Role deleted successfully' };
}




// Permission endpoints:
async function createPermission({ name }) {
  const existing = await Permission.findOne({ where: { name } });


  if (existing) throw Object.assign(new Error('Permission already exists'), { status: 409 });

  const permission = await Permission.create({ name });
  return permission;
}

async function findAllPermissions() {
  const permissions = await Permission.findAll();
  if (!permissions) throw Object.assign(new Error('Permissions not found'), { status: 404 });
  return permissions;
}

async function deletePermission(id) {
  const permission = await Permission.findOne({ where: { id } });
  if (!permission) throw Object.assign(new Error('Permission not found'), { status: 404 });

 
  await permission.update({ deletedAt: new Date() });
  return { message: 'Permission deleted successfully' };
}



// Assign permissions to roles:
async function assignPermissionToRole(roleId, { permissionId }) {
  const role = await Role.findByPk(roleId);


  if (!role) throw Object.assign(new Error('Role not found'), { status: 404 });

  const permission = await Permission.findByPk(permissionId);
  if (!permission) throw Object.assign(new Error('Permission not found'), { status: 404 });

  await role.addPermission(permission);
  return { message: 'Permission assigned successfully' };
}



async function removePermissionFromRole(roleId, { permissionId }) {
  const role = await Role.findByPk(roleId);
  if (!role) throw Object.assign(new Error('Role not found'), { status: 404 });

  const permission = await Permission.findByPk(permissionId);
  if (!permission) throw Object.assign(new Error('Permission not found'), { status: 404 });

  await role.removePermission(permission);
  return { message: 'Permission removed successfully' };
}





// assign role       
async function assignRole(id, {roleName}, requesterId) {
  // get the user id...the requesterid and the data
  const user = await User.findByPk(id);

  if (!user) {
        throw Object.assign(new Error('User not a found'), { status: 404 });
    }
  

  // find role
  const role = await Role.findOne({ where: { name: roleName } });
  
  if (!role) {
        throw Object.assign(new Error('Role not found'), { status: 404 });
    }

  await user.addRole(role);

  return { message: 'Role assigned successfully' }
}


// login user
async function login({ email, password }) {
  const user = await User.findOne({ where: { email } });
  if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

  const valid = await compare(password, user.password);
  if (!valid) throw Object.assign(new Error('Invalid credentials'), { status: 401 });

  const accessToken = generateAccessToken({ sub: user.id });
  const refreshToken = generateRefreshToken({ sub: user.id });

  await user.update({ refreshToken });

  return { accessToken, refreshToken };
}




// refresh token
async function refresh(token) {
  let decoded;
  try {
    decoded = verifyRefreshToken(token);
  } catch {
    throw Object.assign(new Error('Invalid refresh token'), { status: 401 });
  }

  const user = await User.findByPk(decoded.sub);
  if (!user || user.refreshToken !== token) {
    throw Object.assign(new Error('Refresh token reuse detected'), { status: 401 });
  }

  const accessToken = signAccessToken({ sub: user.id });
  const newRefreshToken = signRefreshToken({ sub: user.id });

  // Rotate refresh token
  await user.update({ refreshToken: newRefreshToken });

  return { accessToken, refreshToken: newRefreshToken };
}



// logout
async function logout(userId) {
  await User.update({ refreshToken: null }, { where: { id: userId } });
}





module.exports = { register, createRole, deleteRole,findAllRoles,createPermission, assignPermissionToRole,removePermissionFromRole,findAllPermissions, deletePermission,assignRole,login, refresh, logout };
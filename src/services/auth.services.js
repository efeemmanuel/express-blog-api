const { User, Role } = require('../models');
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





// assign role       
async function assignRole(id, {roleName}, requesterId) {
  // get the user id...the requesterid and the data
  const user = await User.findByPk(id);

  if (!user) {
        throw Object.assign(new Error('User not a found'), { status: 404 });
    }

  // if (user.id !== requesterId) {
  //     throw Object.assign(new Error('Forbidden'), {status: 403})
  // }

  // find role
  const role = await Role.findOne({ where: { name: roleName } });
  
  if (!role) {
        throw Object.assign(new Error('Role not found'), { status: 404 });
    }

  await user.addRole(role);

  return { message: 'Role assigned successfully' }
}


// users create account
// admin can make a user an editor (assign role function)
// admin can add permissions 









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





module.exports = { register, assignRole,login, refresh, logout };
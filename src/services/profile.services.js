const { User } = require('../models');


// update profile
async function updateProfile(id, dto, requesterId, isAdmin) {
    // get the id,  loggedin user and the update body

    // find the id
    const profile = await User.findByPk(id)

    // check if profile exist
    if (!profile) {
        throw Object.assign(new Error('profile not found'), {status: 404})
    }

    // check if the user id is same as the one logged in
    if (!isAdmin && profile.id !== requesterId) {
        throw Object.assign(new Error('forbidden'), {status: 403})
    }

    // update
    return profile.update(dto)
}





// delete profile
async function deleteProfile(id, requesterId, isAdmin) {
  const profile = await User.findByPk(id);

  // check if profile exist
    if (!profile) {
        throw Object.assign(new Error('profile not found'), {status: 404})
    }


  if (!isAdmin && profile.id !== requesterId) {
    throw Object.assign(new Error('Forbidden'), { status: 403 });
  }

  return profile.update({ deletedAt: new Date() });
}


module.exports = {updateProfile, deleteProfile}
const { User, Role, Permission } = require('../models');



async function fetchUser(isAdmin) {
    const user = await User.findAll()

    if (!isAdmin) {
        throw Object.assign(new Error('forbidden'), {status: 403})
    }
    return user
}

async function fetchUserId(id, isAdmin) {
    const user = await User.findByPk(id, {
         include: [{ model: Role }]
    })

    if (!isAdmin) {
        throw Object.assign(new Error('forbidden'), {status: 403})
    }

    return user
}


module.exports = {fetchUser, fetchUserId}
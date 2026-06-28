const adminService = require('../services/admin.services');


async function fetchUser(req,res,next) {

    try {
        const isAdmin = req.user.permissions.includes('manage_users');
        const user = await adminService.fetchUser(isAdmin)
        res.json(user);
    } catch (err) {
        next(err)
    }
}


async function fetchUserId(req,res,next) {
    try {
        const isAdmin = req.user.permissions.includes('manage_users');
        const user = await adminService.fetchUserId(req.params.id, isAdmin);
        res.json(user);
    } catch (err) {
        next(err)
    }
}


module.exports = {fetchUser, fetchUserId}
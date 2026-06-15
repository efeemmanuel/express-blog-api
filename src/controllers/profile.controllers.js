const profileService = require('../services/profile.services');

async function updateProfile(req, res, next) {
    try {
        const profile = await profileService.updateProfile(req.params.id, req.body, req.user.id);
        res.status(200).json(profile);
    } catch (err) {
        next(err);
    }
}

async function deleteProfile(req, res, next) {
    try {
        // const isAdmin = req.user.permissions.includes('manage_users');
        await profileService.deleteProfile(req.params.id, req.user.id);
        res.status(204).send();
    } catch (err) {
        next(err);
    }
}

module.exports = { updateProfile, deleteProfile };
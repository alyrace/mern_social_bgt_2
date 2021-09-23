const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    getUserController, 
    userUpdateController,
    userDeleteController,
    followController,
    unfollowController

} = require('../controller/users');
//get user
router.get('/:id', auth, getUserController);
//update user
router.put('/:id', auth, userUpdateController);
//delete user
router.delete('/:id', auth, userDeleteController);
//follow
router.put('/:id/follow', auth, followController);
//unfollow user
router.put('/:id/unfollow', auth, unfollowController);

module.exports = router;
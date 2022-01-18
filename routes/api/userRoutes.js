import express from 'express';
const router = express.Router();

import uCon from '../../controllers/userController.js';

// /api/users/
router
    .route('/')
    .get(uCon.getAllUsers)
    .post(uCon.createUser);

router
    .route('/:userId')
    .get(uCon.getUserById)
    .put(uCon.updateUser)
    .delete(uCon.deleteUser);

router
    .route('/:userId/friends')
    .post(uCon.addFriend);

router
    .route('/:userId/friends/:friendId')
    .delete(uCon.removeFriend);

export default router;
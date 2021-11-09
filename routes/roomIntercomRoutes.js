const express = require('express');
const roomIntercomController = require('../controllers/roomIntercomController');
const authController = require('./../controllers/authController');


const router = express.Router();

router
    .route('/')
    .get(authController.protect, roomIntercomController.getAllRoomIntercoms)
    .post(authController.protect, roomIntercomController.createRoomIntercom)

router
    .route('/:id')
    .patch(authController.protect, roomIntercomController.updateRoomIntercom)
    .delete(authController.protect, roomIntercomController.deleteRoomIntercom)

module.exports = router;
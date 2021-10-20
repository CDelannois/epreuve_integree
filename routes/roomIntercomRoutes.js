const express = require('express');
const roomIntercomController = require('../controllers/roomIntercomController');

const router = express.Router();

router
    .route('/')
    .get(roomIntercomController.getAllRoomIntercoms)
    .post(roomIntercomController.createRoomIntercom)

// router
//     .route('/:id')
//     .patch(roomIntercomController.updateRoomIntercom)
//     .delete(roomIntercomController.deleteRoomIntercom)

module.exports = router;
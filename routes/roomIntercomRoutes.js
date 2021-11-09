const express = require('express');
const roomIntercomController = require('../controllers/roomIntercomController');
const authController = require('./../controllers/authController');


const router = express.Router();

router
    .route('/')
    .get(authController.protect, roomIntercomController.getAllRoomIntercoms)
    .post(
        authController.protect,
        authController.restrictTo(
            'Directeur',
            'Administratif',
            'Chef-infirmier'),
        roomIntercomController.createRoomIntercom
    )

router
    .route('/:id')
    .patch(
        authController.protect,
        authController.restrictTo(
            'Directeur',
            'Administratif',
            'Chef-infirmier'),
        roomIntercomController.updateRoomIntercom
    )
    .delete(
        authController.protect,
        authController.restrictTo(
            'Directeur',
            'Administratif',
            'Chef-infirmier'),
        roomIntercomController.deleteRoomIntercom
    )

module.exports = router;
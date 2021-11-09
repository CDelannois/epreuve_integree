const express = require('express');
const serviceIntercomController = require('../controllers/serviceIntercomController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
    .route('/')
    .get(authController.protect, serviceIntercomController.getAllServiceIntercoms)
    .post(
        authController.protect,
        authController.restrictTo(
            'Directeur',
            'Administratif',
            'Chef-infirmier'),
        serviceIntercomController.createServiceIntercom
    )

router
    .route('/:id')
    .patch(
        authController.protect,
        authController.restrictTo(
            'Directeur',
            'Administratif',
            'Chef-infirmier'),
        serviceIntercomController.updateServiceIntercom
    )
    .delete(
        authController.protect,
        authController.restrictTo(
            'Directeur',
            'Administratif',
            'Chef-infirmier'),
        serviceIntercomController.deleteServiceIntercom
    )

module.exports = router;
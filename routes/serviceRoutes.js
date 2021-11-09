const express = require('express');
const serviceController = require('../controllers/serviceController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
    .route('/')
    .get(authController.protect, serviceController.getAllServices)
    .post(
        authController.protect,
        authController.restrictTo(
            'Directeur',
            'Administratif',
            'Chef-infirmier'),
        serviceController.createService
    )

router
    .route('/:id')
    .patch(
        authController.protect,
        authController.restrictTo(
            'Directeur',
            'Administratif',
            'Chef-infirmier'),
        serviceController.updateService
    )
    .delete(
        authController.protect,
        authController.restrictTo(
            'Directeur',
            'Administratif',
            'Chef-infirmier'),
        serviceController.deleteService
    )

module.exports = router;
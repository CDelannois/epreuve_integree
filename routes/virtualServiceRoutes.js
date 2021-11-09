const express = require('express');
const virtualServiceController = require('../controllers/virtualServiceController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
    .route('/')
    .get(authController.protect, virtualServiceController.getAllVirtualServices)
    .post(
        authController.protect,
        authController.restrictTo(
            'Directeur',
            'Administratif',
            'Chef-infirmier'),
        virtualServiceController.createVirtualService
    )

router
    .route('/:id')
    .patch(
        authController.protect,
        authController.restrictTo(
            'Directeur',
            'Administratif',
            'Chef-infirmier'),
        virtualServiceController.updateVirtualService
    )
    .delete(
        authController.protect,
        authController.restrictTo(
            'Directeur',
            'Administratif',
            'Chef-infirmier'),
        virtualServiceController.deleteVirtualService
    )

module.exports = router;
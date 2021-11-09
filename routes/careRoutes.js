const express = require('express');
const careController = require('./../controllers/careController');
const authController = require('./../controllers/authController');


const router = express.Router();

router
    .route('/')
    .get(authController.protect, careController.getAllCares)
    .post(
        authController.protect,
        authController.restrictTo(
            'Directeur',
            'Administratif',
            'Chef-infirmier'),
        careController.createCare
    )

router
    .route('/:id')
    .patch(
        authController.protect,
        authController.restrictTo(
            'Directeur',
            'Administratif',
            'Chef-infirmier'),
        careController.updateCare
    )
    .delete(
        authController.protect,
        authController.restrictTo(
            'Directeur',
            'Administratif',
            'Chef-infirmier'),
        careController.deleteCare
    )

module.exports = router;
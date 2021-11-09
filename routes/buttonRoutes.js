const express = require('express');
const buttonController = require('../controllers/buttonController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
    .route('/')
    .get(authController.protect, buttonController.getAllButtons)
    .post(
        authController.protect,
        authController.restrictTo(
            'Directeur',
            'Administratif',
            'Chef-infirmier'),
        buttonController.createButton
    )

router
    .route('/:id')
    .patch(
        authController.protect,
        authController.restrictTo(
            'Directeur',
            'Administratif',
            'Chef-infirmier'),
        buttonController.updateButton
    )
    .delete(
        authController.protect,
        authController.restrictTo(
            'Directeur',
            'Administratif',
            'Chef-infirmier'),
        buttonController.deleteButton
    )

module.exports = router;
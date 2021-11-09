const express = require('express');
const functionController = require('../controllers/functionController');
const authController = require('./../controllers/authController');


const router = express.Router();

router
    .route('/')
    .get(authController.protect, functionController.getAllFunctions)
    .post(
        authController.protect,
        authController.restrictTo(
            'Directeur',
            'Administratif',
            'Chef-infirmier'),
        functionController.createFunction
    )

router
    .route('/:id')
    .patch(
        authController.protect,
        authController.restrictTo(
            'Directeur',
            'Administratif',
            'Chef-infirmier'),
        functionController.updateFunction
    )
    .delete(
        authController.protect,
        authController.restrictTo(
            'Directeur',
            'Administratif',
            'Chef-infirmier'),
        functionController.deleteFunction
    )

module.exports = router;
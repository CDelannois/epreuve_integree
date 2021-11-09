const express = require('express');
const functionController = require('../controllers/functionController');
const authController = require('./../controllers/authController');


const router = express.Router();

router
    .route('/')
    .get(authController.protect, functionController.getAllFunctions)
    .post(authController.protect, functionController.createFunction)

router
    .route('/:id')
    .patch(authController.protect, functionController.updateFunction)
    .delete(authController.protect, functionController.deleteFunction)

module.exports = router;
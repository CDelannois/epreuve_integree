const express = require('express');
const careController = require('./../controllers/careController');
const authController = require('./../controllers/authController');


const router = express.Router();

router
    .route('/')
    .get(authController.protect, careController.getAllCares)
    .post(authController.protect, careController.createCare)

router
    .route('/:id')
    .patch(authController.protect, careController.updateCare)
    .delete(authController.protect, careController.deleteCare)

module.exports = router;
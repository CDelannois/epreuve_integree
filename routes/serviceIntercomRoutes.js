const express = require('express');
const serviceIntercomController = require('../controllers/serviceIntercomController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
    .route('/')
    .get(authController.protect, serviceIntercomController.getAllServiceIntercoms)
    .post(authController.protect, serviceIntercomController.createServiceIntercom)

router
    .route('/:id')
    .patch(authController.protect, serviceIntercomController.updateServiceIntercom)
    .delete(authController.protect, serviceIntercomController.deleteServiceIntercom)

module.exports = router;
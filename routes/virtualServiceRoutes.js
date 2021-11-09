const express = require('express');
const virtualServiceController = require('../controllers/virtualServiceController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
    .route('/')
    .get(authController.protect, virtualServiceController.getAllVirtualServices)
    .post(authController.protect, virtualServiceController.createVirtualService)

router
    .route('/:id')
    .patch(authController.protect, virtualServiceController.updateVirtualService)
    .delete(authController.protect, virtualServiceController.deleteVirtualService)

module.exports = router;
const express = require('express');
const serviceController = require('../controllers/serviceController');

const router = express.Router();

router
    .route('/')
    .get(serviceController.getAllServices)
    .post(serviceController.createService)

router
    .route('/:id')
    .patch(serviceController.updateService)
//     .delete(serviceController.deleteService)

module.exports = router;
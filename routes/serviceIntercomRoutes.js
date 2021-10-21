const express = require('express');
const serviceIntercomController = require('../controllers/serviceIntercomController');

const router = express.Router();

router
    .route('/')
    .get(serviceIntercomController.getAllServiceIntercoms)
    .post(serviceIntercomController.createServiceIntercom)

router
    .route('/:id')
    .patch(serviceIntercomController.updateServiceIntercom)
    .delete(serviceIntercomController.deleteServiceIntercom)

module.exports = router;
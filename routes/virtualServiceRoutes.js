const express = require('express');
const virtualServiceController = require('../controllers/virtualServiceController');

const router = express.Router();

router
    .route('/')
    .get(virtualServiceController.getAllVirtualServices)
    .post(virtualServiceController.createVirtualService)

router
    .route('/:id')
    .patch(virtualServiceController.updateVirtualService)
    .delete(virtualServiceController.deleteVirtualService)

module.exports = router;
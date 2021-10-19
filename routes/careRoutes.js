const express = require('express');
const careController = require('./../controllers/careController');

const router = express.Router();

router
    .route('/')
    .get(careController.getAllCares)
    .post(careController.createCare)

// router
//     .route('/:id')
//     .get(careController.getCare)
//     .patch(careController.updateCare)
//     .delete(careController.deleteCare)

module.exports = router;
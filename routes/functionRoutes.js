const express = require('express');
const functionController = require('../controllers/functionController');

const router = express.Router();

router
    .route('/')
    // .get(functionController.getAllFunctions)
    .post(functionController.createFunction)

// router
//     .route('/:id')
//     .get(functionController.getFunction)
//     .patch(functionController.updateFunction)
//     .delete(functionController.deleteFunction)

module.exports = router;
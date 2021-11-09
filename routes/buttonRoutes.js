const express = require('express');
const buttonController = require('../controllers/buttonController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
    .route('/')
    .get(authController.protect, buttonController.getAllButtons)
    .post(authController.protect, buttonController.createButton)

router
    .route('/:id')
    .patch(authController.protect, buttonController.updateButton)
    .delete(authController.protect, buttonController.deleteButton)

module.exports = router;
const express = require('express');
const buttonController = require('../controllers/buttonController');

const router = express.Router();

router
    .route('/')
    .get(buttonController.getAllButtons)
    .post(buttonController.createButton)

router
    .route('/:id')
    .patch(buttonController.updateButton)
    .delete(buttonController.deleteButton)

module.exports = router;
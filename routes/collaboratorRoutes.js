const express = require('express');
const collaboratorController = require('./../controllers/collaboratorController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
    .route('/')
    .get(authController.protect, collaboratorController.getAllCollaborators)
    .post(authController.protect, collaboratorController.createCollaborator)

router
    .route('/:id')
    .patch(authController.protect, collaboratorController.updateCollaborator)
    .delete(authController.protect, collaboratorController.deleteCollaborator)

router
    .route('/active')
    .get(authController.protect, collaboratorController.getActiveCollaborators);

module.exports = router;
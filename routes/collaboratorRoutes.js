const express = require('express');
const collaboratorController = require('../controllers/collaboratorController');
const authController = require('./../controllers/authController')

const router = express.Router();

router
    .route('/')
    .get(collaboratorController.getAllCollaborators)
    .post(collaboratorController.createCollaborator)

router
    .route('/:id')
    .patch(collaboratorController.updateCollaborator)
    .delete(collaboratorController.deleteCollaborator)

router
    .route('/active')
    .get(collaboratorController.getActiveCollaborators);

router
    .route('/login')
    .post(authController.login)

module.exports = router;
const express = require('express');
const collaboratorController = require('../controllers/collaboratorController');

const router = express.Router();

router
    .route('/')
    .get(collaboratorController.getAllCollaborators)
    .post(collaboratorController.createCollaborator)

router
    .route('/:id')
    .get(collaboratorController.getOneCollaborator)
    .patch(collaboratorController.updateCollaborator)
//     .delete(collaboratorController.deleteCollaborator)

module.exports = router;
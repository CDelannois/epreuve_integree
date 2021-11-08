const express = require('express');
const collaboratorHistoryController = require('../controllers/collaboratorHistoryController');

const router = express.Router();

router
    .route('/')
    .get(collaboratorHistoryController.getAllCollaboratorsHistory)
    .post(collaboratorHistoryController.createCollaboratorHistory)

router
    .route('/:id')
    .patch(collaboratorHistoryController.updateCollaboratorHistory)
    .delete(collaboratorHistoryController.deleteCollaboratorHistory)

module.exports = router;
const express = require('express');
const collaboratorHistoryController = require('../controllers/collaboratorHistoryController');

const router = express.Router();

router
    .route('/')
    .get(collaboratorHistoryController.getAllCollaboratorsHistory)
    .post(collaboratorHistoryController.createCollaboratorHistory)

router
    .route('/current')
    .get(collaboratorHistoryController.getActiveCollaboratorsHistory)

router
    .route('/:id')
    .patch(collaboratorHistoryController.updateCollaboratorHistory)
    .delete(collaboratorHistoryController.deleteCollaboratorHistory)

router
    .route('/end/:id')
    .patch(collaboratorHistoryController.endWork);
module.exports = router;
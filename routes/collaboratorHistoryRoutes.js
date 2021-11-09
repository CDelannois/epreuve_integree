const express = require('express');
const collaboratorHistoryController = require('../controllers/collaboratorHistoryController');
const authController = require('./../controllers/authController');


const router = express.Router();

router
    .route('/end')
    .patch(authController.protect, collaboratorHistoryController.endWork);

router
    .route('/')
    .get(authController.protect, collaboratorHistoryController.getAllCollaboratorsHistory)
    .post(authController.protect, collaboratorHistoryController.createCollaboratorHistory)

router
    .route('/current')
    .get(authController.protect, collaboratorHistoryController.getActiveCollaboratorsHistory)

router
    .route('/:id')
    .patch(
        authController.protect,
        authController.restrictTo(
            'Directeur',
            'Administratif',
            'Chef-infirmier'),
        collaboratorHistoryController.updateCollaboratorHistory
    )
    .delete(
        authController.protect,
        authController.restrictTo(
            'Directeur',
            'Administratif',
            'Chef-infirmier'),
        collaboratorHistoryController.deleteCollaboratorHistory
    )

module.exports = router;
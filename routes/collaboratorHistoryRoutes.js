const express = require('express');
const collaboratorHistoryController = require('../controllers/collaboratorHistoryController');
const authController = require('./../controllers/authController');


const router = express.Router();

router
    .route('/')
    .get(authController.protect, collaboratorHistoryController.getAllCollaboratorsHistory)
    .post(
        authController.protect,
        authController.restrictTo(
            'Directeur',
            'Administratif',
            'Chef-infirmier'),
        collaboratorHistoryController.createCollaboratorHistory
    )

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

router
    .route('/end/:id')
    .patch(authController.protect, collaboratorHistoryController.endWork);
module.exports = router;
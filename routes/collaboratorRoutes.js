const express = require('express');
const collaboratorController = require('./../controllers/collaboratorController');
const authController = require('./../controllers/authController');

const router = express.Router();

router
    .route('/')
    .get(authController.protect, collaboratorController.getAllCollaborators)
    .post(
        authController.protect,
        authController.restrictTo(
            'Directeur',
            'Administratif',
            'Chef-infirmier'),
        collaboratorController.createCollaborator
    )

router
    .route('/:id')
    .patch(
        authController.protect,
        authController.restrictTo(
            'Directeur',
            'Administratif',
            'Chef-infirmier'),
        collaboratorController.updateCollaborator
    )
    .delete(
        authController.protect,
        authController.restrictTo(
            'Directeur',
            'Administratif',
            'Chef-infirmier'),
        collaboratorController.deleteCollaborator
    )

router
    .route('/active')
    .get(authController.protect, collaboratorController.getActiveCollaborators);

module.exports = router;
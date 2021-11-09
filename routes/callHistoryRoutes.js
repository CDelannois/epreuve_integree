const express = require('express');
const callHistoryController = require('./../controllers/callHistoryController');
const authController = require('./../controllers/authController');

const router = express.Router();


router
    .route('/')
    .get(authController.protect, callHistoryController.getAllCallsHistory)
    .post(authController.protect, callHistoryController.createCallHistory)

router
    .route('/currentCalls')
    .get(authController.protect, callHistoryController.getCurrentCalls)

router
    .route('/:id')
    .patch(
        authController.protect,
        authController.restrictTo(
            'Directeur',
            'Administratif',
            'Chef-infirmier'),
        callHistoryController.updateCallHistory
    )
    .delete(
        authController.protect,
        authController.restrictTo(
            'Directeur',
            'Administratif',
            'Chef-infirmier'),
        callHistoryController.deleteCallHistory
    )

router
    .route('/act/:id')
    .patch(authController.protect, callHistoryController.actCallHistory)

module.exports = router;
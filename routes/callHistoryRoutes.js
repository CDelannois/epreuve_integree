const express = require('express');
const callHistoryController = require('../controllers/callHistoryController');

const router = express.Router();


router
    .route('/currentCalls')
    .get(callHistoryController.getCurrentCalls)

router
    .route('/')
    .get(callHistoryController.getAllCallsHistory)
    .post(callHistoryController.createCallHistory)

router
    .route('/:id')
    .patch(callHistoryController.updateCallHistory)
    .delete(callHistoryController.deleteCallHistory)

router
    .route('/act/:id')
    .patch(callHistoryController.actCallHistory)

module.exports = router;
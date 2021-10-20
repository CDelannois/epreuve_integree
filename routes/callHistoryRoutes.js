const express = require('express');
const callHistoryController = require('../controllers/callHistoryController');

const router = express.Router();

router
    .route('/')
    .get(callHistoryController.getAllCallsHistory)
    .post(callHistoryController.createCallHistory)

router
    .route('/:id')
    .get(callHistoryController.getOneCallHistory)
//     .patch(callHistoryController.updateCallHistory)
//     .delete(callHistoryController.deleteCallHistory)

module.exports = router;
const CallHistory = require('./../models/callHistoryModel');

exports.getAllCallsHistory = async (req, res) => {
    try {
        const callsHistory = await CallHistory.find()

        res.status(200).json({
            status: 'succes',
            results: callsHistory.length,
            data: {
                callsHistory
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
}

exports.createCallHistory = async (req, res) => {
    try {
        const newCallHistory = await CallHistory.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                callHistory: newCallHistory
            }
        });
    } catch (err) {
        console.log(req.body);
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}
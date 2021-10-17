const CallHistory = require('./../models/callHistoryModel');

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
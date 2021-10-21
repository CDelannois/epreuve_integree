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
};

exports.getOneCallHistory = async (req, res) => {
    try {
        const callHistory = await CallHistory.findById(req.params.id);

        res.status(200).json({
            status: 'succes',
            data: {
                callHistory
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
};

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
};

exports.updateCallHistory = async (req, res) => {
    try {
        const updatedCallHistory = await CallHistory.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })
        res.status(200).json({
            status: 'succes',
            data: {
                callHistory: updatedCallHistory
            }
        })
    }
    catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
};

exports.deleteCallHistory = async (req, res) => {

    try {
        await CallHistory.findByIdAndDelete(req.params.id)
        res.status(204).json({
            status: 'succes'
        })
    }
    catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
};
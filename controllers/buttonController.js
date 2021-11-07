const Button = require('./../models/buttonModel');
const CallHistory = require('./../models/callHistoryModel');

exports.getAllButtons = async (req, res) => {
    try {
        const buttons = await Button.aggregate([{
            $project: {
                __v: 0
            }
        }]);
        res.status(200).json({
            status: 'success',
            results: buttons.length,
            data: {
                buttons
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
};

exports.createButton = async (req, res) => {
    try {
        const newButton = await Button.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                button: newButton
            }
        });
    } catch (err) {

        if (err.name === 'MongoError' && err.code === 11000) {
            res.status(400).json({
                status: 'fail',
                message: 'This name or key is already used.'
            })
        } else {
            res.status(400).json({
                status: 'fail',
                message: err
            })
        }
    }
};

exports.updateButton = async (req, res) => {
    try {
        const updatedButton = await Button.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })
        res.status(200).json({
            status: 'success',
            data: {
                button: updatedButton
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

exports.deleteButton = async (req, res) => {

    //Avant la suppression, vérifier historique appel
    try {
        const callHistory = await CallHistory.findOne({ location: req.params.id });

        if (callHistory) {
            res.status(400).json({
                status: 'fail',
                message: `This button is used in another entry. It coudldn't be deleted.`
            });
        } else {
            await Button.findByIdAndDelete(req.params.id)
            res.status(204).json({
                status: 'success'
            })
        }
    }
    catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
};
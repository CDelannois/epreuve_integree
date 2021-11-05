const Care = require('./../models/careModel');
const CallHistory = require('./../models/callHistoryModel');

exports.getAllCares = async (req, res) => {
    try {
        const cares = await Care.aggregate([{
            $project: {
                __v: 0
            }
        }])

        res.status(200).json({
            status: 'succes',
            results: cares.length,
            data: {
                cares
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
};

exports.createCare = async (req, res) => {
    try {
        const newCare = await Care.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                care: newCare
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
};

exports.updateCare = async (req, res) => {
    try {
        const updatedCare = await Care.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })
        res.status(200).json({
            status: 'succes',
            data: {
                care: updatedCare
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

exports.deleteCare = async (req, res) => {

    //Avant la suppression, vérifier historique appel
    try {
        const callHistory = await CallHistory.findOne({ service: req.params.id });

        if (callHistory.length > 0) {
            res.status(200).json({
                status: 'stopped',
                message: `This care is used in another entry. It coudldn't be deleted.`
            });
        } else {
            await Care.findByIdAndDelete(req.params.id)
            res.status(204).json({
                status: 'succes'
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
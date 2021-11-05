const Function = require('./../models/functionModel');
const Collaborator = require('./../models/collaboratorModel');
const Service = require('./../models/serviceModel');

exports.getAllFunctions = async (req, res) => {
    try {
        const functions = await Function.aggregate([{
            $project: {
                __v: 0
            }
        }])

        res.status(200).json({
            status: 'succes',
            results: functions.length,
            data: {
                functions
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
};

exports.createFunction = async (req, res) => {
    try {
        const newFunction = await Function.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                function: newFunction
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
};

exports.updateFunction = async (req, res) => {
    try {
        const updatedFunction = await Function.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })
        res.status(200).json({
            status: 'succes',
            data: {
                function: updatedFunction
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

exports.deleteFunction = async (req, res) => {

    try {
        // Avant la suppression, vérifier collaborateur et service.
        const collaborator = await Collaborator.findOne({ function: req.params.id });
        const service = await Service.findOne({ level3: req.params.id });

        if (collaborator || service) {
            res.status(200).json({
                status: 'stopped',
                message: `This function is used in another entry. It coudldn't be deleted.`
            });
        } else {
            await Function.findByIdAndDelete(req.params.id)
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
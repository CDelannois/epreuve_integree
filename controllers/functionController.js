const Function = require('./../models/functionModel');

exports.getAllFunctions = async (req, res) => {
    try {
        const functions = await Function.find()

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
}

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
}
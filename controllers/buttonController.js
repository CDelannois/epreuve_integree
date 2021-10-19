const Button = require('./../models/buttonModel');

exports.getAllButtons = async (req, res) => {
    try {
        const buttons = await Button.find()

        res.status(200).json({
            status: 'succes',
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
}

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
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}
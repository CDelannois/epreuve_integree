const Button = require('./../models/buttonModel');

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
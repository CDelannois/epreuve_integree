const Function = require('./../models/functionModel');

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
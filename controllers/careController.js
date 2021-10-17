const Care = require('./../models/careModel');

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
}
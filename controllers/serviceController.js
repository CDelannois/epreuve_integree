const Service = require('./../models/serviceModel');

exports.createService = async (req, res) => {
    try {
        const newService = await Service.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                service: newService
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}
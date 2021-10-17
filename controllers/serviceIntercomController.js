const ServiceIntercom = require('./../models/serviceIntercomModel');

exports.createServiceIntercom = async (req, res) => {
    try {
        const newServiceIntercom = await ServiceIntercom.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                serviceIntercom: newServiceIntercom
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}
const ServiceIntercom = require('./../models/serviceIntercomModel');

exports.getAllServiceIntercoms = async (req, res) => {
    try {
        const serviceIntercoms = await ServiceIntercom.find()
        res.status(200).json({
            status: 'succes',
            results: serviceIntercoms.length,
            data: {
                serviceIntercoms
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
}

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
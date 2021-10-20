const Service = require('./../models/serviceModel');

exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.find()

        res.status(200).json({
            status: 'succes',
            results: services.length,
            data: {
                services
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
};

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
};

exports.updateService = async (req, res) => {
    try {
        const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })
        res.status(200).json({
            status: 'succes',
            data: {
                service: updatedService
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
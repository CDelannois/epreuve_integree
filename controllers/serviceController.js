const Service = require('./../models/serviceModel');
const CallHistory = require('./../models/callHistoryModel');
const CollaboratorHistory = require('./../models/collaboratorHistoryModel');
const ServiceIntercom = require('./../models/serviceIntercomModel');

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

exports.deleteService = async (req, res) => {

    try {
        const callHistory = await CallHistory.findOne({ service: req.params.id });
        const collaboratorHistory = await CollaboratorHistory.findOne({ service: req.params.id });
        const serviceIntercom = await ServiceIntercom.findOne({ service: req.params.id });

        if (callHistory || collaboratorHistory || serviceIntercom) {
            res.status(200).json({
                status: 'stopped',
                message: `This collaborator is used in another entry. It coudldn't be deleted.`
            });
        } else {
            await Service.findByIdAndDelete(req.params.id)
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
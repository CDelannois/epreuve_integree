const Service = require('./../models/serviceModel');
const CallHistory = require('./../models/callHistoryModel');
const CollaboratorHistory = require('./../models/collaboratorHistoryModel');
const ServiceIntercom = require('./../models/serviceIntercomModel');

exports.getAllServices = async (req, res) => {
    try {
        const services = await Service.aggregate([
            {
                $lookup: {
                    from: 'functions',
                    localField: 'level1',
                    foreignField: '_id',
                    as: 'level1'
                }
            }, {
                $lookup: {
                    from: 'functions',
                    localField: 'level2',
                    foreignField: '_id',
                    as: 'level2'
                }
            }, {
                $lookup: {
                    from: 'functions',
                    localField: 'level3',
                    foreignField: '_id',
                    as: 'level3'
                }
            }, {
                $unwind: '$level1'
            }, {
                $unwind: '$level2'
            }, {
                $unwind: '$level3'
            }, {
                $group: {
                    _id: '$_id',
                    level1: {
                        $addToSet: '$level1.title',
                    },
                    level2: {
                        $addToSet: '$level2.title'
                    },
                    level3: {
                        $addToSet: '$level3.title'
                    },
                }
            }, {
                $lookup: {
                    from: 'services',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'servicesDetails'
                }
            }, {
                $unwind: {
                    path: '$servicesDetails'
                }
            }, {
                $addFields: {
                    'servicesDetails.level1': '$level1',
                    'servicesDetails.level2': '$level2',
                    'servicesDetails.level3': '$level3',
                }
            }, {
                $replaceRoot: {
                    newRoot: '$servicesDetails'
                }
            }, {
                $project: {
                    __v: 0
                }
            }
        ])

        res.status(200).json({
            status: 'success',
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
            status: 'success',
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
                message: `This service is used in another entry. It coudldn't be deleted.`
            });
        } else {
            await Service.findByIdAndDelete(req.params.id)
            res.status(204).json({
                status: 'success'
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
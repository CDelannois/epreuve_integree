const VirtualService = require('./../models/virtualServiceModel');
const CallHistory = require('./../models/callHistoryModel');
const CollaboratorHistory = require('./../models/collaboratorHistoryModel');

exports.getAllVirtualServices = async (req, res) => {
    try {
        const virtualServices = await VirtualService.aggregate([{
            $lookup: {
                from: 'services',
                localField: 'services',
                foreignField: '_id',
                as: 'services'
            }
        }, {
            $unwind: '$services'
        }, {
            $group: {
                _id: '$_id',
                services: {
                    $addToSet: '$services.name'
                }
            }
        }, {
            $lookup: {
                from: 'virtualservices',
                localField: '_id',
                foreignField: '_id',
                as: 'virtualServicesDetails'
            }
        }, {
            $unwind: {
                path: '$virtualServicesDetails'
            }
        }, {
            $addFields: {
                'virtualServicesDetails.services': '$services'
            }
        }, {
            $replaceRoot: {
                newRoot: '$virtualServicesDetails'
            }
        }, {
            $project: {
                __v: 0
            }
        }])

        res.status(200).json({
            status: 'success',
            results: virtualServices.length,
            data: {
                virtualServices
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
};

exports.createVirtualService = async (req, res) => {
    try {
        const newVirtualService = await VirtualService.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                virtualService: newVirtualService
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
};

exports.updateVirtualService = async (req, res) => {
    try {
        const updatedVirtualService = await VirtualService.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })
        res.status(200).json({
            status: 'success',
            data: {
                virtualService: updatedVirtualService
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

exports.deleteVirtualService = async (req, res) => {

    try {
        const callHistory = await CallHistory.findOne({ service: req.params.id });
        const collaboratorHistory = await CollaboratorHistory.findOne({ service: req.params.id });

        if (callHistory || collaboratorHistory) {
            res.status(200).json({
                status: 'stopped',
                message: `This service is used in another entry. It coudldn't be deleted.`
            });
        } else {
            await VirtualService.findByIdAndDelete(req.params.id)
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
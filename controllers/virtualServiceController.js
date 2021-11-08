const VirtualService = require('./../models/virtualServiceModel');
const CallHistory = require('./../models/callHistoryModel');
const CollaboratorHistory = require('./../models/collaboratorHistoryModel');
const Service = require('./../models/serviceModel');

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAllVirtualServices = catchAsync(async (req, res, next) => {
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
});

exports.createVirtualService = catchAsync(async (req, res, next) => {

    //Vérification des services
    const services = req.body.services;
    let serviceExist = true;

    for (let i = 0; i < services.length; i++) {
        let serviceInVirtual = await Service.findById(services[i]);
        if (!serviceInVirtual) {
            serviceExist = false
        }
    }

    if (!serviceExist) {
        return next(new AppError('One of the services does not exist.', 404));
    }

    const newVirtualService = await VirtualService.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            virtualService: newVirtualService
        }
    });
});

exports.updateVirtualService = catchAsync(async (req, res, next) => {

    //Vérification des services
    if (req.body.services) {
        const services = req.body.services;
        let serviceExist = true;

        for (let i = 0; i < services.length; i++) {
            let serviceInVirtual = await Service.findById(services[i]);
            if (!serviceInVirtual) {
                serviceExist = false
            }
        }

        if (!serviceExist) {
            return next(new AppError('One of the services does not exist.', 404));
        }
    }
    const updatedVirtualService = await VirtualService.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })

    if (!updatedVirtualService) {
        return next(new AppError('This virtual service does not exist.', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            virtualService: updatedVirtualService
        }
    })
});

exports.deleteVirtualService = catchAsync(async (req, res, next) => {

    const callHistory = await CallHistory.findOne({ service: req.params.id });
    const collaboratorHistory = await CollaboratorHistory.findOne({ service: req.params.id });

    if (callHistory || collaboratorHistory) {
        return next(new AppError('This virtual service is used somewhere else.', 400));
    }

    const deletedVirtualService = await VirtualService.findByIdAndDelete(req.params.id)

    if (!deletedVirtualService) {
        return next(new AppError('This virtual service does not exist.', 404));
    }

    res.status(204).json({
        status: 'success'
    })
});
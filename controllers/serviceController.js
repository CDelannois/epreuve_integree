const Service = require('./../models/serviceModel');
const Function = require('./../models/functionModel');
const CallHistory = require('./../models/callHistoryModel');
const CollaboratorHistory = require('./../models/collaboratorHistoryModel');
const ServiceIntercom = require('./../models/serviceIntercomModel');

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAllServices = catchAsync(async (req, res, next) => {
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
    ]);

    res.status(200).json({
        status: 'success',
        results: services.length,
        data: {
            services
        }
    });
});

exports.createService = catchAsync(async (req, res, next) => {

    //Vérification des fonctions
    const functions = req.body.level3;
    let functionExist = true;

    for (let i = 0; i < functions.length; i++) {
        let functionInService = await Function.findById(functions[i]);
        if (!functionInService) {
            functionExist = false
        }
    }

    if (!functionExist) {
        return next(new AppError('One of the functions does not exist.', 404));
    }

    const newService = await Service.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            service: newService
        }
    });
});

exports.updateService = catchAsync(async (req, res, next) => {

    //Vérification des fonctions
    if (req.body.level3) {
        const functions = req.body.level3;
        let functionExist = true;

        for (let i = 0; i < functions.length; i++) {
            let functionInService = await Function.findById(functions[i]);
            if (!functionInService) {
                functionExist = false
            }
        }

        if (!functionExist) {
            return next(new AppError('One of the functions does not exist.', 404));
        }
    };

    const updatedService = await Service.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!updatedService) {
        return next(new AppError('This service does not exist.', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            service: updatedService
        }
    })
});

exports.deleteService = catchAsync(async (req, res, next) => {

    const callHistory = await CallHistory.findOne({ service: req.params.id });
    const collaboratorHistory = await CollaboratorHistory.findOne({ service: req.params.id });
    const serviceIntercom = await ServiceIntercom.findOne({ service: req.params.id });

    if (callHistory || collaboratorHistory || serviceIntercom) {
        return next(new AppError('This service is used somewhere else.', 400));
    }

    const deletedService = await Service.findByIdAndDelete(req.params.id)

    if (!deletedService) {
        return next(new AppError('This service does not exist.', 404));
    }

    res.status(204).json({
        status: 'success'
    })

});
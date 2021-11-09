const ServiceIntercom = require('./../models/serviceIntercomModel');
const Service = require('./../models/serviceModel');

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAllServiceIntercoms = catchAsync(async (req, res, next) => {
    const serviceIntercoms = await ServiceIntercom.aggregate([{
        $lookup: {
            from: 'services',
            localField: 'service',
            foreignField: '_id',
            as: 'service'
        }
    }, {
        $unwind: '$service'
    }, {
        $addFields: {
            service: "$service.name"
        }
    }])
    res.status(200).json({
        status: 'success',
        results: serviceIntercoms.length,
        data: {
            serviceIntercoms
        }
    })
});

exports.createServiceIntercom = catchAsync(async (req, res, next) => {
    const service = await Service.findById(req.body.service);

    if (!service) {
        return next(new AppError('This service does not exist.', 404));
    }

    const newServiceIntercom = await ServiceIntercom.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            serviceIntercom: newServiceIntercom
        }
    });
});

exports.updateServiceIntercom = catchAsync(async (req, res, next) => {
    if (req.body.service) {
        const service = await Service.findById(req.body.service);
        if (!service) {
            return next(new AppError('This service does not exist.', 404));
        }
    }

    const updatedServiceIntercom = await ServiceIntercom.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!updatedServiceIntercom) {
        return next(new AppError('This service intercom does not exist.', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            serviceIntercom: updatedServiceIntercom
        }
    })
});

exports.deleteServiceIntercom = catchAsync(async (req, res, next) => {
    const deletedServiceIntercom = await ServiceIntercom.findByIdAndDelete(req.params.id)

    if (!deletedServiceIntercom) {
        return next(new AppError('This service intercom does not exist.'));
    }

    res.status(204).json({
        status: 'success'
    })
});
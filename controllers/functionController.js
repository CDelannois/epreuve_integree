const Function = require('./../models/functionModel');
const Collaborator = require('./../models/collaboratorModel');
const Service = require('./../models/serviceModel');

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAllFunctions = catchAsync(async (req, res, next) => {

    const functions = await Function.aggregate([{
        $project: {
            __v: 0
        }
    }])

    res.status(200).json({
        status: 'success',
        results: functions.length,
        data: {
            functions
        }
    })
});

exports.createFunction = catchAsync(async (req, res, next) => {
    const newFunction = await Function.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            function: newFunction
        }
    });
});

exports.updateFunction = catchAsync(async (req, res, next) => {
    const updatedFunction = await Function.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })

    if (!updatedFunction) {
        return next(new AppError('This function does not exist.', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            function: updatedFunction
        }
    })
});

exports.deleteFunction = catchAsync(async (req, res, next) => {

    // Avant la suppression, vérifier collaborateur et service.
    const collaborator = await Collaborator.findOne({ function: req.params.id });
    const service = await Service.findOne({ level3: req.params.id });

    if (collaborator || service) {
        return next(new AppError('This function is used somewhere else.', 400));
    }

    const deletedFunction = await Function.findByIdAndDelete(req.params.id)

    if (!deletedFunction) {
        return next(new AppError('This function does not exist.', 404));
    }

    res.status(204).json({
        status: 'success'
    })
});
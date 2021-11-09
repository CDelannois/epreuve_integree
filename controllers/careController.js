const Care = require('./../models/careModel');
const CallHistory = require('./../models/callHistoryModel');

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAllCares = catchAsync(async (req, res, next) => {
    const cares = await Care.find()

    res.status(200).json({
        status: 'success',
        results: cares.length,
        data: {
            cares
        }
    })
});

exports.createCare = catchAsync(async (req, res, next) => {
    const newCare = await Care.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            care: newCare
        }
    });
});

exports.updateCare = catchAsync(async (req, res, next) => {
    const updatedCare = await Care.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })

    if (!updatedCare) {
        return next(new AppError(`This care does not exist.`, 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            care: updatedCare
        }
    })
});

exports.deleteCare = catchAsync(async (req, res, next) => {

    //Avant la suppression, vérifier historique appel
    const callHistory = await CallHistory.findOne({ location: req.params.id });

    if (callHistory) {
        return next(new AppError(`This care is used somewhere else.`, 400));
    }

    const deletedCare = await Care.findByIdAndDelete(req.params.id)

    if (!deletedCare) {
        return next(new AppError(`This care does not exist.`, 404));
    }

    res.status(204).json({
        status: 'success'
    })
});
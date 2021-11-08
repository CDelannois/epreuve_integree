const Button = require('./../models/buttonModel');
const CallHistory = require('./../models/callHistoryModel');

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAllButtons = catchAsync(async (req, res) => {
    const buttons = await Button.aggregate([{
        $project: {
            __v: 0
        }
    }]);
    res.status(200).json({
        status: 'success',
        results: buttons.length,
        data: {
            buttons
        }
    })
});

exports.createButton = catchAsync(async (req, res, next) => {
    const newButton = await Button.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            button: newButton
        }
    });
});

exports.updateButton = catchAsync(async (req, res, next) => {
    const updatedButton = await Button.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })

    if (!updatedButton) {
        return next(new AppError(`This button does not exist.`, 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            button: updatedButton
        }
    });
});

exports.deleteButton = catchAsync(async (req, res, next) => {
    const callHistory = await CallHistory.findOne({ location: req.params.id });
    //Avant la suppression, vérifier historique appel
    if (callHistory) {
        return next(new AppError(`This button is used elsewhere.`, 400));
    }

    const deletedButton = await Button.findByIdAndDelete(req.params.id)

    if (!deletedButton) {
        return next(new AppError('This button does not exist.', 404));
    }
    res.status(204).json({
        status: 'success'
    });
});
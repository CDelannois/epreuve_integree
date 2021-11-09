const RoomIntercom = require('./../models/roomIntercomModel');

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAllRoomIntercoms = catchAsync(async (req, res, next) => {

    const roomIntercoms = await RoomIntercom.find()

    res.status(200).json({
        status: 'success',
        results: roomIntercoms.length,
        data: {
            roomIntercoms
        }
    })
});

exports.createRoomIntercom = catchAsync(async (req, res, next) => {
    const newRoomIntercom = await RoomIntercom.create(req.body);

    res.status(201).json({
        status: 'success',
        data: {
            roomIntercom: newRoomIntercom
        }
    });
});

exports.updateRoomIntercom = catchAsync(async (req, res, next) => {
    const updatedRoomIntercom = await RoomIntercom.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!updatedRoomIntercom) {
        return next(new AppError('This room intercom does not exist.', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            roomIntercom: updatedRoomIntercom
        }
    });
});

exports.deleteRoomIntercom = catchAsync(async (req, res, next) => {
    const deletedRoomIntercom = await RoomIntercom.findByIdAndDelete(req.params.id);

    if (!deletedRoomIntercom) {
        return next(new AppError('This room intercom does not exist.', 404));
    }

    res.status(204).json({
        status: 'success'
    })
});
const RoomIntercom = require('./../models/roomIntercomModel');

exports.getAllRoomIntercoms = async (req, res) => {
    try {
        const roomIntercoms = await RoomIntercom.aggregate([{
            $project: {
                __v: 0
            }
        }])

        res.status(200).json({
            status: 'succes',
            results: roomIntercoms.length,
            data: {
                roomIntercoms
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
};

exports.createRoomIntercom = async (req, res) => {
    try {
        const newRoomIntercom = await RoomIntercom.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                roomIntercom: newRoomIntercom
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
};

exports.updateRoomIntercom = async (req, res) => {
    try {
        const updatedRoomIntercom = await RoomIntercom.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })
        res.status(200).json({
            status: 'succes',
            data: {
                roomIntercom: updatedRoomIntercom
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

exports.deleteRoomIntercom = async (req, res) => {

    try {
        await RoomIntercom.findByIdAndDelete(req.params.id)
        res.status(204).json({
            status: 'succes'
        })
    }
    catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
};
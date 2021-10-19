const RoomIntercom = require('./../models/roomIntercomModel');

exports.getAllRoomIntercoms = async (req, res) => {
    try {
        const roomIntercoms = await RoomIntercom.find()

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
}

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
}
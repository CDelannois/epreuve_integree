const RoomIntercom = require('./../models/roomIntercomModel');

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
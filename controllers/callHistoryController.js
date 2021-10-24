const CallHistory = require('./../models/callHistoryModel');

exports.getAllCallsHistory = async (req, res) => {
    try {
        const callsHistory = await CallHistory.find()

        res.status(200).json({
            status: 'succes',
            results: callsHistory.length,
            data: {
                callsHistory
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
};

exports.getOneCallHistory = async (req, res) => {
    try {
        const callHistory = await CallHistory.findById(req.params.id);

        res.status(200).json({
            status: 'succes',
            data: {
                callHistory
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
};

exports.createCallHistory = async (req, res) => {
    try {
        //Tant qu'un appel est en cours dans la chambre, un .nouvel appel ne peut pas commencer.
        const callHistory = await CallHistory.find({
            $and: [{
                room: req.body.room
            },
            {
                actage: {
                    collaborator: "0000a0a00a0aaa000a0a00aa"
                }
            }]
        });
        if (callHistory.length > 0) {
            res.status(201).json({
                status: 'success',
                message: 'A call is already pending for this room.',
            });
        }
        else {
            const newCallHistory = await CallHistory.create(req.body);
            //Quand il est créé, il doit être référencé dans l'appel des soignants actifs dans ce service à ce moment.
            res.status(201).json({
                status: 'success',
                data: {
                    callHistory: newCallHistory
                }
            });
        }
    } catch (err) {
        console.log(req.body);
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
};

exports.updateCallHistory = async (req, res) => {
    try {
        const updatedCallHistory = await CallHistory.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })
        res.status(200).json({
            status: 'succes',
            data: {
                callHistory: updatedCallHistory
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

exports.deleteCallHistory = async (req, res) => {

    try {
        await CallHistory.findByIdAndDelete(req.params.id)
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
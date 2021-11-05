const CallHistory = require('./../models/callHistoryModel');
const CollaboratorHistory = require('./../models/collaboratorHistoryModel');

const basePipe = [{
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
}, {
    $lookup: {
        from: 'buttons',
        localField: 'location',
        foreignField: '_id',
        as: 'location'
    }
}, {
    $unwind: '$location'
}, {
    $addFields: {
        location: "$location.name"
    }
}, {
    $lookup: {
        from: 'collaborators',
        localField: 'actage.collaborator',
        foreignField: '_id',
        as: 'actage.collaborator'
    }
}, {
    $unwind: {
        path: '$actage.collaborator',
        preserveNullAndEmptyArrays: true
    }
}, {
    $addFields: {
        actage: {
            collaborator: "$actage.collaborator.name"
        }
    }
}, {
    $project: {
        __v: 0
    }
}]

const finish = [{
    $match: { endDate: { $gt: new Date(0) } }
}];

const finishedPipe = basePipe.concat(finish);

exports.getAllCallsHistory = async (req, res) => {
    try {
        const callsHistory = await CallHistory.aggregate(finishedPipe);

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
            message: err + " "
        })
    }
};

const match = [{
    $match: { endDate: new Date(0) }
}];

const current = [{
    $project: {
        endDate: 0,
        actage: 0
    }
}];

let currentCallsPipe = match.concat(basePipe);
currentCallsPipe = currentCallsPipe.concat(current);

exports.getCurrentCalls = async (req, res) => {
    try {
        const currentCalls = await CallHistory.aggregate(currentCallsPipe);

        res.status(200).json({
            status: 'succes',
            results: currentCalls.length,
            data: {
                currentCalls
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err + " "
        })
    }
}

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
        //Tant qu'un appel est en cours dans la chambre, un nouvel appel ne peut pas commencer.
        const callHistory = await CallHistory.find({
            $and: [{
                room: req.body.room
            }, {
                endDate: 0
            }]
        });
        if (callHistory.length > 0) {
            res.status(400).json({
                status: 'fail',
                message: 'A call is already pending for this room.',
            });
        }
        else {
            const newCallHistory = await CallHistory.create(req.body);
            await CollaboratorHistory.updateMany({
                $and: [{
                    service: req.body.service
                }, {
                    logoutDate: new Date(0)
                }]
            }, {
                $push: {
                    calls: newCallHistory._id
                }
            });
            res.status(201).json({
                status: 'success',
                data: {
                    callHistory: newCallHistory
                }
            });
        }
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err + ' '
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

exports.actCallHistory = async (req, res) => {
    try {
        const callHistory = await CallHistory.findById(req.params.id);
        if (new Date((callHistory.endDate)) > new Date(callHistory.beginDate)) {
            res.status(404).json({
                status: 'fail',
                message: 'This call has already been acted.'
            })
        } else {
            req.body.endDate = Date.now();
            req.body.actage.date = Date.now();
            const actedCallHistory = await CallHistory.findByIdAndUpdate(req.params.id, req.body, {
                new: true,
                runValidators: true,
            })
            res.status(200).json({
                status: 'succes',
                data: {
                    callHistory: actedCallHistory
                }
            })
        };
    } catch (err) {
        console.log(err);
    }
}

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
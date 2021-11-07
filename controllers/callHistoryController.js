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
            status: 'success',
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
            status: 'success',
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
            status: 'success',
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
        const collaboratorHistory = await CollaboratorHistory.findById(req.body.actage.collaborator);
        const callHistory = await CallHistory.findById(req.params.id);
        if (new Date(callHistory.endDate) > new Date(callHistory.beginDate)) {
            res.status(404).json({
                status: 'fail',
                message: 'This call has already been acted.'
            });
        } else {
            if (new Date(collaboratorHistory.logoutDate) > new Date(collaboratorHistory.loginDate || collaboratorHistory.service != callHistory.service)) {
                res.status(404).json({
                    status: fail,
                    message: 'This collaborator cannot act this call'
                })
            } else {
                req.body.endDate = Date.now();
                const actedCallHistory = await CallHistory.findByIdAndUpdate(req.params.id, req.body, {
                    new: true,
                    runValidators: true,
                });
                await CollaboratorHistory.findByIdAndUpdate(req.body.actage.collaborator, {
                    $push: {
                        actage: callHistory._id
                    }
                })
                res.status(200).json({
                    status: 'success',
                    data: {
                        callHistory: actedCallHistory
                    },
                })
            }
        };
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err + ' '
        })
    }
}

exports.deleteCallHistory = async (req, res) => {

    try {
        await CallHistory.findByIdAndDelete(req.params.id)
        res.status(204).json({
            status: 'success'
        })
    }
    catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
};
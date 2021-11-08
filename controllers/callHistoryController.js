const CallHistory = require('./../models/callHistoryModel');
const CollaboratorHistory = require('./../models/collaboratorHistoryModel');
const Service = require('./../models/serviceModel');
const Button = require('./../models/buttonModel');

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

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

exports.getAllCallsHistory = catchAsync(async (req, res, next) => {
    const callsHistory = await CallHistory.aggregate(finishedPipe);

    res.status(200).json({
        status: 'success',
        results: callsHistory.length,
        data: {
            callsHistory
        }
    })
});

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

exports.getCurrentCalls = catchAsync(async (req, res, next) => {
    const currentCalls = await CallHistory.aggregate(currentCallsPipe);

    res.status(200).json({
        status: 'success',
        results: currentCalls.length,
        data: {
            currentCalls
        }
    })
});

exports.createCallHistory = catchAsync(async (req, res, next) => {
    //Tant qu'un appel est en cours dans la chambre, un nouvel appel ne peut pas commencer.
    const callHistory = await CallHistory.find({
        $and: [{
            room: req.body.room
        }, {
            endDate: 0
        }]
    });
    if (callHistory.length > 0) {
        return next(new AppError('There is already a call pending.', 400));
    }

    const location = await Button.findById(req.body.location);

    if (!location) {
        return next(new AppError(`This button does not exist`, 404));
    }

    const service = await Service.findById(req.body.service);

    if (!service) {
        return next(new AppError(`This service does not exist`, 404));
    }

    const newCallHistory = await CallHistory.create(req.body);

    //Ajout de l'appel pour les soignants actifs dans le service.
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
});

exports.updateCallHistory = catchAsync(async (req, res, next) => {
    const updatedCallHistory = await CallHistory.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })

    if (!updatedCallHistory) {
        return next(new AppError(`This call does not exist.`, 404));
    }

    if (req.body.location) {
        const button = await Button.findById(req.body.location);
        if (!button) {
            return next(new AppError('This button does not exist.', 404));
        }
    }

    if (req.body.service) {
        const service = await Service.findById(req.body.service);
        if (!service) {
            return next(new AppError('This service does not exist.', 404));
        }
    }

    res.status(200).json({
        status: 'success',
        data: {
            callHistory: updatedCallHistory
        }
    })
});

exports.actCallHistory = catchAsync(async (req, res, next) => {
    const callHistory = await CallHistory.findById(req.params.id);

    //Si l'appel n'existe pas ==> erreur
    if (!callHistory) {
        return next(new AppError(`This call does not exist.`, 404));
    }

    //Si l'appel est fini ==> erreur
    if (new Date(callHistory.endDate) > new Date(callHistory.beginDate)) {
        return next(new AppError('This call has already ended.', 400));
    }

    const collaboratorHistory = await CollaboratorHistory.findById(req.body.actage.collaborator);

    //Si le collaborateur n'existe pas ==> erreur
    if (!collaboratorHistory) {
        return next(new AppError(`This collaborator does not exist.`), 404);
    }

    //Si le soignant n'est pas actif ou pas autorisé dans le service ==> erreur
    if (new Date(collaboratorHistory.logoutDate) > new Date(collaboratorHistory.loginDate || collaboratorHistory.service != callHistory.service)) {
        return next(new AppError('Collaborator not allowed to act in this service.'), 401);
    }

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
});

exports.deleteCallHistory = catchAsync(async (req, res, next) => {
    const callHistory = await CallHistory.findByIdAndDelete(req.params.id)

    if (!callHistory) {
        return next(new AppError(`This call does not exist.`), 404);
    }

    res.status(204).json({
        status: 'success'
    })
});
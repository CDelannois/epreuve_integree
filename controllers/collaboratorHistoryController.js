const Collaborator = require('../models/collaboratorModel');
const CollaboratorHistory = require('./../models/collaboratorHistoryModel');
const Function = require('./../models/functionModel');
const Service = require('./../models/serviceModel');
const VirtualService = require('./../models/virtualServiceModel');

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const basePipe = [{
    $lookup: {
        from: 'collaborators',
        localField: 'collaborator',
        foreignField: '_id',
        as: 'collaborator'
    }
}, {
    $unwind: '$collaborator'
}, {
    $addFields: {
        collaborator: '$collaborator.name'
    }
}, {
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
}];

const ended = [{
    $match: {
        logoutDate: { $gt: new Date(0) }
    }
}]

const inactivePipe = ended.concat(basePipe);

exports.getAllCollaboratorsHistory = catchAsync(async (req, res, next) => {
    const collaboratorsHistory = await CollaboratorHistory.aggregate(inactivePipe)

    res.status(200).json({
        status: 'success',
        results: collaboratorsHistory.length,
        data: {
            collaboratorsHistory
        }
    })
});

const active = [{
    $match: {
        logoutDate: new Date(0)
    }
}, {
    $project: {
        logoutDate: 0
    }
}]

const activePipe = basePipe.concat(active);

exports.getActiveCollaboratorsHistory = catchAsync(async (req, res, next) => {
    const collaboratorsHistory = await CollaboratorHistory.aggregate(activePipe);

    res.status(200).json({
        status: 'success',
        results: collaboratorsHistory.length,
        date: {
            collaboratorsHistory
        }
    })
});

exports.createCollaboratorHistory = catchAsync(async (req, res, next) => {

    req.body.collaborator = req.collaborator._id;
    //Possible que si le collaborateur n'est pas déjà actif.
    let service = await Service.findById(req.body.service);

    if (!service) {
        service = await VirtualService.findById(req.body.service);
        if (!service) {
            return next(new AppError(`This service does not exist.`, 404));
        }
        const serviceID = service.services[0];
        service = await Service.findById(serviceID);
    }

    const collaborator = await Collaborator.findById(req.body.collaborator);
    const collaboratorFunction = collaborator.function;

    if (!service.level3.includes(collaboratorFunction)) {
        return next(new AppError(`This collaborator isn't allowed in this service.`, 400));
    }

    const activeCollaborator = await CollaboratorHistory.find({
        $and: [{
            collaborator: req.body.collaborator
        }, {
            logoutDate: 0
        }]
    });

    if (activeCollaborator.length > 0) {
        return next(new AppError(`This collaborator is already active.`, 400));
    }

    const newCollaboratorHistory = await CollaboratorHistory.create(req.body)
    const activeCollaborators = await Collaborator.findByIdAndUpdate(req.body.collaborator, { active: true })
    const activeCollaboratorsCount = await Collaborator.find({
        $and: [{
            active: true
        }, {
            function: activeCollaborators.function
        }]
    });
    const update = { enabled: activeCollaboratorsCount.length };
    await Function.findByIdAndUpdate(activeCollaborators.function, update);
    res.status(201).json({
        status: 'success',
        data: {
            collaboratorHistory: newCollaboratorHistory
        }
    });
});

exports.updateCollaboratorHistory = catchAsync(async (req, res, next) => {
    const updatedCollaboratorHistory = await CollaboratorHistory.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    })

    if (!updatedCollaboratorHistory) {
        return next(new AppError(`This collaborator entry does not exist.`, 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            collaboratorHistory: updatedCollaboratorHistory
        }
    })
});

exports.endWork = catchAsync(async (req, res, next) => {

    const endWork = await CollaboratorHistory.find({ collaborator: req.collaborator._id, logoutDate: new Date(0) });

    if (!endWork) {
        return next(new AppError('This collaborator entry does not exist.', 404));
    }

    if (endWork[0].logoutDate > endWork[0].loginDate) {
        return next(new AppError('This collaborator entry has already ended.', 400));
    }

    //Mise à jour de la date de fin de travail.
    const updateCollaboratorHistory = { logoutDate: Date.now() };
    const updatedCollaboratorHistory = await CollaboratorHistory.findByIdAndUpdate(endWork[0]._id, updateCollaboratorHistory);

    //Mise à jour du statut du collaborateur.
    const updateCollaborator = { active: false };
    const updatedCollaborator = await Collaborator.findByIdAndUpdate(updatedCollaboratorHistory.collaborator, updateCollaborator);

    //Mise à jour du nombre de personnes actives au sein de la fonction.
    const activeFunction = await Collaborator.find({ active: true, function: updatedCollaborator.function });
    const activeFunctionNumber = { enabled: activeFunction.length };
    const enabledFunction = await Function.findByIdAndUpdate(updatedCollaborator.function, activeFunctionNumber);

    res.status(200).json({
        status: "success",
        message: updatedCollaborator.name + " logged out. Currently " + activeFunction.length + " active " + enabledFunction.title + "."
    })

});

exports.deleteCollaboratorHistory = catchAsync(async (req, res, next) => {

    const deletedCollaboratorHistory = await CollaboratorHistory.findByIdAndDelete(req.params.id)

    if (!deletedCollaboratorHistory) {
        return next(new AppError(`This collaborator entry does not exist.`))
    }

    res.status(204).json({
        status: 'success'
    })
});
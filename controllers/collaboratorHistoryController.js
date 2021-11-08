const Collaborator = require('../models/collaboratorModel');
const CollaboratorHistory = require('./../models/collaboratorHistoryModel');
const Function = require('./../models/functionModel');
const Service = require('./../models/serviceModel');
const VirtualService = require('./../models/virtualServiceModel');

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

exports.getAllCollaboratorsHistory = catchAsync(async (req, res, next) => {
    const collaboratorsHistory = await CollaboratorHistory.aggregate([{
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
    }, {
        $project: {
            __v: 0
        }
    }])

    res.status(200).json({
        status: 'success',
        results: collaboratorsHistory.length,
        data: {
            collaboratorsHistory
        }
    })
});

exports.createCollaboratorHistory = catchAsync(async (req, res, next) => {
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

    if (!collaborator) {
        return next(new AppError(`This collaborator does not exist.`, 404));
    }

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

exports.deleteCollaboratorHistory = catchAsync(async (req, res, next) => {

    const deletedCollaboratorHistory = await CollaboratorHistory.findByIdAndDelete(req.params.id)

    if (!deletedCollaboratorHistory) {
        return next(new AppError(`This collaborator entry does not exist.`))
    }

    res.status(204).json({
        status: 'success'
    })
});
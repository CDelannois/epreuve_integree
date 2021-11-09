const Collaborator = require('./../models/collaboratorModel');
const Function = require('./../models/functionModel');
const CollaboratorHistory = require('./../models/collaboratorHistoryModel');

const catchAsync = require('./../utils/catchAsync');
const AppError = require('./../utils/appError');

const basePipe = [{
    $lookup: {
        from: 'functions',
        localField: 'function',
        foreignField: '_id',
        as: 'function'
    }
}, {
    $unwind: '$function'
}, {
    $addFields: {
        function: "$function.title"
    }
}, {
    $project: {
        password: 0
    }
}];

exports.getAllCollaborators = catchAsync(async (req, res, next) => {
    const collaborators = await Collaborator.aggregate(basePipe);

    res.status(200).json({
        status: 'success',
        results: collaborators.length,
        data: {
            collaborators
        }
    });
});

const active = [{
    $match: {
        active: true
    }
}];

const activePipe = active.concat(basePipe);

exports.getActiveCollaborators = catchAsync(async (req, res, next) => {
    const activeCollaborators = await Collaborator.aggregate(activePipe);

    res.status(200).json({
        status: 'success',
        results: activeCollaborators.length,
        data: {
            activeCollaborators
        }
    });
});

exports.createCollaborator = catchAsync(async (req, res, next) => {
    const functionExist = await Function.findById(req.body.function);

    if (!functionExist) {
        return next(new AppError(`This function does not exist.`, 404));
    }

    const newCollaborator = await Collaborator.create(req.body);
    const functionTotal = await Collaborator.find({ function: req.body.function });
    const update = { total: functionTotal.length };
    const functionUpdate = await Function.findByIdAndUpdate(req.body.function, update, { new: true });
    res.status(201).json({
        status: 'success',
        data: {
            collaborator: newCollaborator,
            newAmount: functionUpdate.total
        }
    });
});

exports.updateCollaborator = catchAsync(async (req, res, next) => {
    const updatedCollaborator = await Collaborator.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
    });

    if (!updatedCollaborator) {
        return next(new AppError(`This collaborator does not exist.`), 404);
    }

    res.status(200).json({
        status: 'success',
        data: {
            collaborator: updatedCollaborator
        }
    })
});

exports.deleteCollaborator = catchAsync(async (req, res, next) => {

    //Avant suppression, vérifier historique collaborateur
    const collaboratorHistory = await CollaboratorHistory.findOne({ collaborator: req.params.id });

    if (collaboratorHistory) {
        return next(new AppError(`This collaborator is used elsewhere.`, 400));
    }

    const collaboratorFunction = await Collaborator.findById(req.params.id);

    // Récupération de l'id de la fonction pour mettre à jour le nombre.
    const idFunction = collaboratorFunction.function;
    await Collaborator.findByIdAndDelete(req.params.id);
    const functionTotal = await Function.findById(idFunction);
    const update = { total: functionTotal.length };
    await Function.findByIdAndUpdate(idFunction, update, { new: true });
    res.status(204).json({
        status: 'success'
    })
});
const Collaborator = require('./../models/collaboratorModel');
const Function = require('./../models/functionModel');
const CollaboratorHistory = require('./../models/collaboratorHistoryModel');
const hash = require('./passwordHash');

exports.getAllCollaborators = async (req, res) => {
    try {
        const collaborators = await Collaborator.aggregate([{
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
                __v: 0
            }
        }])

        res.status(200).json({
            status: 'succes',
            results: collaborators.length,
            data: {
                collaborators
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
};

exports.getOneCollaborator = async (req, res) => {
    try {
        const collaborator = await Collaborator.findById(req.params.id);

        res.status(200).json({
            status: 'succes',
            data: {
                collaborator
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
};

exports.createCollaborator = async (req, res) => {
    req.body.password = hash(req.body.password);
    try {
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
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
};

exports.updateCollaborator = async (req, res) => {
    if (req.body.password) {
        req.body.password = hash(req.body.password);
    };
    try {
        const updatedCollaborator = await Collaborator.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })
        res.status(200).json({
            status: 'succes',
            data: {
                collaborator: updatedCollaborator
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

exports.deleteCollaborator = async (req, res) => {

    try {
        //Avant suppression, vérifier historique collaborateur
        const collaboratorHistory = await CollaboratorHistory.findOne({ collaborator: req.params.id });

        if (collaboratorHistory) {
            res.status(200).json({
                status: 'stopped',
                message: `This collaborator is used in another entry. It coudldn't be deleted.`
            });
        }
        else {
            const collaboratorFunction = await Collaborator.findById(req.params.id);
            const idFunction = collaboratorFunction.function;
            await Collaborator.findByIdAndDelete(req.params.id);
            const functionTotal = await Function.findById(idFunction);
            const update = { total: functionTotal.length };
            await Function.findByIdAndUpdate(idFunction, update, { new: true });
            res.status(204).json({
                status: 'succes'
            })
        }
    }
    catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
};
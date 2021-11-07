const Collaborator = require('../models/collaboratorModel');
const CollaboratorHistory = require('./../models/collaboratorHistoryModel');
const Function = require('./../models/functionModel');
const Service = require('./../models/serviceModel');

exports.getAllCollaboratorsHistory = async (req, res) => {
    try {
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
        },{
            $project:{
                __v:0
            }
        }])

        res.status(200).json({
            status: 'success',
            results: collaboratorsHistory.length,
            data: {
                collaboratorsHistory
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
};

exports.getOneCollaboratorHistory = async (req, res) => {
    try {
        const collaboratorHistory = await CollaboratorHistory.findById(req.params.id);

        res.status(200).json({
            status: 'success',
            data: {
                collaboratorHistory
            }
        })
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        })
    }
};

exports.createCollaboratorHistory = async (req, res) => {
    //Possible que si le collaborateur n'est pas déjà actif.
    try {
        let service = await Service.findById(req.body.service);
        if (service.virtual === true) {
            const serviceID = service.services[0]
            service = await Service.findById(serviceID);
        };
        const collaborator = await Collaborator.findById(req.body.collaborator);
        const collaboratorFunction = collaborator.function;

        if (service.level3.includes(collaboratorFunction)) {

            const activeCollaborator = await CollaboratorHistory.find({
                $and: [{
                    collaborator: req.body.collaborator
                }, {
                    logoutDate: 0
                }]
            });
            if (activeCollaborator.length > 0) {
                res.status(201).json({
                    status: 'cancelled',
                    message: 'This collaborator is already active.',
                });
            } else {
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
            }
        } else {
            res.status(201).json({
                status: 'cancelled',
                message: `This collaborator isn't allowed in this service.`
            })
        }
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
};

exports.updateCollaboratorHistory = async (req, res) => {
    try {
        const updatedCollaboratorHistory = await CollaboratorHistory.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        })
        res.status(200).json({
            status: 'success',
            data: {
                collaboratorHistory: updatedCollaboratorHistory
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

exports.deleteCollaboratorHistory = async (req, res) => {

    try {
        await CollaboratorHistory.findByIdAndDelete(req.params.id)
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
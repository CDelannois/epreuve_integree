const CollaboratorHistory = require('./../models/collaboratorHistoryModel');

exports.getAllCollaboratorsHistory = async (req, res) => {
    try {
        const collaboratorsHistory = await CollaboratorHistory.find()

        res.status(200).json({
            status: 'succes',
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
            status: 'succes',
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
    try {
        const newCollaboratorHistory = await CollaboratorHistory.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                collaboratorHistory: newCollaboratorHistory
            }
        });
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
            status: 'succes',
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
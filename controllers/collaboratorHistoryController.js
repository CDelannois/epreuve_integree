const CollaboratorHistory = require('./../models/collaboratorHistoryModel');

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
}
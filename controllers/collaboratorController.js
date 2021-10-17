const Collaborator = require('./../models/collaboratorModel');

exports.createCollaborator = async (req, res) => {
    try {
        const newCollaborator = await Collaborator.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                collaborator: newCollaborator
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err
        })
    }
}
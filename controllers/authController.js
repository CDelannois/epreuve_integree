const jwt = require('jsonwebtoken');
const Collaborator = require('./../models/collaboratorModel');
const AppError = require('./../utils/appError');
const signToken = id => {
    return jwt.sign({ id }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_EXPIRES_IN
    })
}

exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;
        //Vérification: l'utilisateur a-t-il entré son email et son mot de passe?
        if (!email || !password) {
            return next(new AppError('Please provide email and password.', 400));
        }

        //Vérification: le nom d'utilisateur et le mot de passe correspondent-ils?
        const collaborator = await Collaborator.findOne({ email }).select('+password');

        if (!collaborator || !(await collaborator.correctPassword(password, collaborator.password))) {
            return next(new AppError('Incorrect email or password.', 401));
        }


        //Renvoi du token vers le client
        const token = signToken(collaborator._id);
        res.status(200).json({
            status: "success",
            token
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            error: err + " "
        })
    }
}
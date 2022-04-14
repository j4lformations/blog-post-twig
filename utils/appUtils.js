// Crée par Joachim Zadi le 13/04/2022 à 10:09. Version 1.0
// ========================================================
const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId
const moment = require('moment');
const jwt = require('jsonwebtoken');

/**
 * Permet de capitaliser un mot
 * @param mot Le mot à capitaliser
 * @returns {string} Le mot capitalisé
 */
exports.capitalizeWord = (mot) => {
    if (mot) {
        return mot.trim().toLowerCase().replace(/^\w/, c => c.toUpperCase());
    }
}

/**
 * Permet de calculer l'age à partir de la date de naissance
 * @param ddn La date de naissane
 * @returns {number} L'âge calculé
 */
exports.calculAge = ddn => {
    return moment().diff(moment(ddn, "YYYY-MM-DD"), 'years');
}

/**
 * Permet de convertir la date de naissance saisie par l'utilsateur en date
 * @param ddn
 * @returns {Date}
 */
exports.convertDdnToDate = ddn => {
    return moment(ddn, "DD/MM/YYYY").toDate()
}

/**
 * Permet de creer et renvoyer un token à l'utilisateur
 * @param user
 * @param statusCode
 * @param req
 * @param res
 */
exports.createAndSendToken = (user, statusCode, req, res) => {

    // On creer le payload
    const payload = {
        id: user._id,
        prenom: user.prenom,
        email: user.email
    }

    // La clé secrète
    const secretOrPrivateKey = process.env.JWT_SECRET;

    const token = jwt.sign(payload, secretOrPrivateKey, {expiresIn: process.env.JWT_EXPIRES_IN});

    // On injecte le token dans la reponse pour creer un cookie de nom jwt de valeur token
    res.cookie('jwt', token, {
            expires: new Date(Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000),
            httpOnly: true
        }
    );

    // On masque le mot de passe du user dans la reponse
    user.mdp = undefined;

    // On renvoie la reponse au user
    res
        .status(statusCode)
        .json({
            status: 'succes',
            user: user
        });
}

/**
 * Permet de generer une erreur particulier
 * @param error
 * @param message
 * @returns {Error}
 */
exports.customError = (message) => {
    const error = new Error();
    error.statusCode = 400;
    error.message = message;
    return error;
}


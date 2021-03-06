// Crée par Joachim Zadi le 13/04/2022 à 10:09. Version 1.0
// ========================================================

const createError = require("http-errors");
const moment = require('moment');
const jwt = require('jsonwebtoken');
const passport = require("passport");

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
    res.redirect('/');
}

/**
 * Permet de generer une erreur particulier
 * @param message
 * @returns {Error}
 */
exports.customError = (message) => {
    const error = new Error();
    error.statusCode = 400;
    error.message = message;
    return error;
}
/**
 * Permet de generer les messages d'erreurs
 * @param res
 */
exports.genereMsgError = (res) => {
    for (const el of res.locals.errors) {
        if (el.path === 'prenom') {
            res.locals.prenomError = el.message;
        }
        if (el.path === 'ddn') {
            res.locals.ddnError = el.message;
        }
        if (el.path === 'email') {
            res.locals.emailError = el.message;
        }
        if (el.path === 'mdp') {
            res.locals.mdpError = el.message;
        }
        if (el.path === 'mdpConfirm') {
            res.locals.mdpConfirmError = el.message;
        }
    }
}

// Middleware permettant de tester la presence du token
exports.requireLoginOrRegister = (req, res, next) => {
    if (!req.cookies['jwt']) {
        const error = new Error();
        error.message = `Merci de créer un compte si vous n'en avez pas sinon ou bien vous authentifier`;
        next(createError(401, error));
    } else {
        next();
    }
}
/**
 * Permet de proteger les routes
 */
exports.requireAuth = passport.authenticate('jwt', {session: false});



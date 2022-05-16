// Crée par Joachim Zadi le 14/04/2022 à 13:19. Version 1.0
// ========================================================
const createError = require("http-errors");
const User = require('../models/userModel');
const appUtils = require('../features/appUtils');
const {JSONCookie} = require("cookie-parser");


/**
 * Permet d'afficher le formulaire d'enregistrement
 * @param req
 * @param res
 */
exports.formRegister = (req, res) => {
    res.render('auth/register', {
        titrePage: 'Page Register',
        url: req.originalUrl
    });
}

/**
 * Permet à un user de creer son compte
 * @param req
 * @param res
 * @param next
 * @returns {Promise<*>}
 */
exports.register = async (req, res, next) => {
    let user = new User(req.body);
    try {
        user = await user.save();
        // Le user est automatiquement connecté apres son inscription
        appUtils.createAndSendToken(user, 201, req, res);
    } catch (error) {
        return next(createError(error.statusCode, error));
    }
}

/**
 * Permet d'afficher le formulaire de login
 * @param req
 * @param res
 */
exports.formLogin = (req, res) => {
    res.render('auth/login', {
        titrePage: 'Page Login',
        titre: 'page login'
    });
}

/**
 * Permet de se logguer
 * @param req
 * @param res
 * @param next
 * @returns {Promise<void>}
 */
exports.login = async (req, res, next) => {
    const {email, mdp} = req.body;

    if (!email || !mdp) {
        const error = appUtils.customError('Veuillez renseigner votre identifiant et un mot de passe');
        return next(createError(error.statusCode, error));
    }

    const user = await User.findOne({email}).select('+mdp');
    if (!user || !(await user.verifyMdp(mdp, user.mdp))) {
        const error = appUtils.customError('Identifiant et/ou mot de passe incorrect');
        return next(createError(error.statusCode, error));
    }
    appUtils.createAndSendToken(user, 200, req, res);
}

/**
 * Permet de se deconnecter du systeme
 */
exports.logout = async (req, res) => {
    res.cookie('jwt', 'deconnecté', {
        expires: new Date(Date.now() + 10 * 1000),
        httpOnly: true
    });

    res.redirect('/');
}
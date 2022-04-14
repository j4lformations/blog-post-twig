// Crée par Joachim Zadi le 14/04/2022 à 13:19. Version 1.0
// ========================================================
const createError = require("http-errors");
const User = require('../models/userModel');
const appUtils = require('../utils/appUtils');

/**
 * Permet d'afficher le formulaire d'enregistrement
 * @param req
 * @param res
 */
exports.formRegister = (req, res) => {
    res.json({
        msg: "Affiche le formulaire d'enregistrement"
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
    try {
        let user = new User(req.body);
        user = await user.save();

        // const url = `${req.protocol}://${req.get('host')}/moi`;
        // console.log(url);

        // Le user est automatiquement connecté apres son inscription
        appUtils.createAndSendToken(user, 201, req, res);
    } catch (error) {
        return next(createError(500, error));
    }
}

/**
 * Permet d'afficher le formulaire de login
 * @param req
 * @param res
 */
exports.formLogin = (req, res) => {
    res.json({
        msg: "Affiche le formulaire d'authentification"
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
    // On verifie que l'email et le mdp passe sont bien renseigner
    if (!email || !mdp) {
        const error = appUtils.customError('Veuillez renseigner votre identifiant et un mot de passe')
        return next(createError(error.statusCode, error));
    }

    // On vérifie si l'utilisateur existe et le mot de passe est correct
    const user = await User.findOne({email}).select('+mdp');
    if (!user || !(await user.verifyMdp(mdp, user.mdp))) {
        const error = appUtils.customError('Identifiant et/ou mot de passe incorrect')
        return next(createError(error.statusCode, error));
    }

    // A ce stade, tout est OK et on envoie le token au client
    appUtils.createAndSendToken(user, 200, req, res);
}
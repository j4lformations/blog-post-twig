// Crée par Joachim Zadi le 08/04/2022 à 21:51. Version 1.0
// ========================================================
const User = require('../models/userModel');
const createError = require("http-errors");
const appUtils = require('../features/appUtils');

exports.allUsers = async (req, res, next) => {
    try {
        const users = await User.find({});
        res.json({
            status: res.statusCode,
            data: users
        });
    } catch (error) {
        return next(createError(400, error));
    }
}

exports.saveOrUpdateUser = async (req, res, next) => {
    req.body.ddn = appUtils.convertDdnToDate(req.body.ddn);
    try {
        let user;
        if (!req.params.id) {
            // Pour une insertion
            user = new User(req.body);
            user = await user.save();
        } else {
            // Pour une mise a jour
            user = await User.findOne({_id: req.params.id});
            for (const key of Object.keys(req.body)) {
                user[key] = req.body[key];
            }
            user = await user.save();
        }
        res.json({
            status: res.statusCode,
            data: user
        });
    } catch (error) {
        return next(createError(400, error));
    }
}

exports.findUserById = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        res.json({
            statut: res.statusCode,
            data: user
        })
    } catch (error) {
        return next(createError(400, error));
    }
}


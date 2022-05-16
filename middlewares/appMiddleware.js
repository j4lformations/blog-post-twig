// Crée par Joachim Zadi le 08/04/2022 à 18:47. Version 1.0
// ========================================================

const express = require("express");
const path = require('path');
const passport = require('passport');
const cors = require('cors');
const createError = require("http-errors");
const logger = require("morgan");
const cookieParser = require("cookie-parser");
const indexRouter = require('../routes/index');
const usersRouter = require('../routes/usersRouter');
const authRouter = require('../routes/authRouter');
const gestionErreur = require('../errors/errorBuilder');
const appUtils = require('../features/appUtils');

const middleware = (app) => {
    // CONFIGURATION DU MOTEUR DE VUE
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'twig');

    if (process.env.NODE_ENV === 'development') {
        app.use(logger('dev'));
    }

    app.use(express.json());
    app.use(express.urlencoded({extended: false}));
    app.use(passport.initialize());
    app.use(cors());
    app.use(cookieParser());
    app.use(express.static(path.join(__dirname, '../public')));

    // MIDDLEWARE DE ROUTAGE
    app.use('/auth', authRouter);
    app.use('/users', usersRouter);
    app.use('/', indexRouter);

    // GESTION DE LA TRANSMISSION DES ERREURS 404
    app.use(function (req, res, next) {
        next(createError(404));
    });

    // GESTION GLOBALE DES ERREURS DE L'APPLICATION
    app.use(function (err, req, res, next) {

        // On normalise les erreurs
        gestionErreur(err);

        // On journalise le message d'erreur dans la console
        logger(err.message);

        // On ajoute le message d'erreur dans la locals de la reponse
        res.locals.message = err.message;
        res.locals.user = req.body;
        res.locals.errors = err.errors ? err.errors : [];
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        appUtils.genereMsgError(res);

        const url = req.originalUrl;

        if (url.endsWith('register')) {
            res.render('auth/register', {
                titrePage: 'page register',
                titre: 'page register'
            });
        } else if (url.endsWith('login')) {
            res.render('auth/login', {
                titrePage: 'page login',
                titre: 'page login'
            });
        } else {
            res.render('error');
        }
    });
}

module.exports = middleware;
// Crée par Joachim Zadi le 08/04/2022 à 18:47. Version 1.0
// ========================================================

const cors = require('cors');
const createError = require("http-errors");
const path = require('path');
const logger = require("morgan");
const express = require("express");
const passport = require('passport');
const cookieParser = require("cookie-parser");
const indexRouter = require('../routes/index');
const usersRouter = require('../routes/usersRouter');
const gestionErreur = require('../errors/errorBuilder');


const middleware = (app) => {
    // CONFIGURATION DU MOTEUR DE VUE
    app.set('views', path.join(__dirname, '../views'));
    app.set('view engine', 'twig');

    if (process.env.NODE_ENV === 'dev') {
        app.use(logger('dev'));
    }

    app.use(express.json());
    app.use(express.urlencoded({extended: false}));
    app.use(cors());
    app.use(cookieParser());
    app.use(passport.initialize());
    app.use(express.static(path.join(__dirname, '../public')));

    // MIDDLEWARE DE ROUTAGE
    app.use('/users', usersRouter);
    app.use('/', indexRouter);

    // GESTION DE LA TRANSMISSION DES ERREURS 404
    app.use(function (req, res, next) {
        next(createError(404));
    });

    // GESTION GLOBALE DES ERREURS DE L'APPLICATION
    app.use(function (err, req, res, next) {

        // On recupere l'erreur normaliser
        const error = gestionErreur(err);

        // On journalise le message d'erreur dans la console
        logger(err.message);

        // On ajoute le message d'erreur dans la locals de la reponse
        res.locals.message = err.message;
        res.locals.error = req.app.get('env') === 'development' ? err : {};

        // RENDU DE LA PAGE D'ERREURS
        res.status(err.statusCode || 500);
        res.render('error');
    });
}

module.exports = middleware;
// Crée par Joachim Zadi le 15/04/2022 à 14:42. Version 1.0
// ========================================================
const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

router
    .route('/register')
    .get(authController.formRegister)
    .post(authController.register);

router
    .route('/login')
    .get(authController.formLogin)
    .post(authController.login);

router
    .route('/logout')
    .get(authController.logout);

module.exports = router;

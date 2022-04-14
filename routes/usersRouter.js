const express = require('express');
const router = express.Router();
const userController = require('../controllers/usersController')
const authController = require('../controllers/authController')

router
    .route('/')
    .get(userController.allUsers)
    .post(userController.saveOrUpdateUser);

router
    .route('/register')
    .get(authController.formRegister)
    .post(authController.register);

router
    .route('/login')
    .get(authController.formLogin)
    .post(authController.login);



router
    .route('/:id')
    .get(userController.findUserById)
    .put(userController.saveOrUpdateUser);
module.exports = router;

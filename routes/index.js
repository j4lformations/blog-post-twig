const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

/* GET home page. */
router.get('/', async function (req, res, next) {
    let cookie = req.cookies.jwt;
    let currentUser = null;

    if (cookie && cookie !== 'deconnecté') {
        let decode = jwt.verify(cookie, process.env.JWT_SECRET);
        console.log(decode);
        currentUser = await User.findOne({'email': decode.email});
    }

    res.render('index', {
        titre: 'Accueil',
        titrePage: 'Accueil',
        user: currentUser
    });

});

module.exports = router;

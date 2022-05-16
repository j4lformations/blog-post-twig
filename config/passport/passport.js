// Crée par Joachim Zadi le 13/04/2022 à 21:17. Version 1.0
// ========================================================
const passport = require('passport');
const JwtStrategy = require('passport-jwt').Strategy;
const User = require('../../models/userModel');

const opts = {};

// Cette option permet de recuperer le token du tableau de cookies
opts.jwtFromRequest = req => {
    let token = null;
    if (req && req.cookies) {
        token = req.cookies['jwt'];
    }
    return token;
};

// Cette option permet renseigner la clé de signature
opts.secretOrKey = process.env.JWT_SECRET;

passport.use(new JwtStrategy(opts, function (jwt_payload, done) {
    User.findOne({id: jwt_payload.id}, function (error, user) {
        if (error) {
            return done(err, false);
        }
        if (user) {
            return done(null, user);
        } else {
            return done(null, false);
        }
    });
}));
// Crée par Joachim Zadi le 08/04/2022 à 19:07. Version 1.0
// ========================================================

const mongoose = require('mongoose');
const validator = require('validator');
const {capitalCase} = require('capital-case');
const moment = require('moment');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    prenom: {
        type: String,
        require: [true, "Le champ prenom est requis"],
        trim: true
    },
    ddn: Date,
    email: {
        type: String,
        trim: true,
        require: [true, "Le champ email est requis"],
        unique: [true, "L'adresse email <<{VALUE}>> est déjà utilisé"],
        lowercase: true,
        validate: [validator.isEmail, "Veuillez saisir un e-mail valide"]
    },
    mdp: {
        type: String,
        require: [true, "Le champ mot de passe est requis"],
        minlength: [8, "Le mot de passe doit contenir 8 caractères au moins"],
        select: false
    },
    mdpConfirm: {
        type: String,
        require: [true, "Veuillez confirmer votre mot de passe !!!"],
        validate: {
            validator: function (value) {
                return value === this.mdp;
            },
            message: "Les mots de passe ne correspondent pas"
        }
    },
    avatar: {
        type: String,
        default: "avatar.png"
    },
    actif: {
        type: Boolean,
        default: true,
        select: false
    }
}, {timestamps: true, toJSON: {virtuals: true}});

UserSchema.virtual('age').get(function () {
    return new Date().getFullYear() - this.ddn.getFullYear();
})

UserSchema.pre('save', function (next) {
    this.prenom = capitalCase(this.prenom);
    next();
});

const User = mongoose.model('User', UserSchema);
module.exports = User;
// Crée par Joachim Zadi le 08/04/2022 à 19:07. Version 1.0
// ========================================================

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const appUtils = require('../features/appUtils');
const beautifyUnique = require('mongoose-beautiful-unique-validation');
const moment = require("moment");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
    prenom: {
        type: String,
        required: [true, "Le champ prénom est requis"],
        trim: true
    },
    ddn: {
        type: Date,
        required: [true, "Le champ date de naissance est requis"]
    },
    email: {
        type: String,
        trim: true,
        required: [true, "Le champ email est requis"],
        unique: [true, "L'adresse email {VALUE} est déjà utilisé"],
        lowercase: true,
        validate: [validator.isEmail, "L'adresse e-mail {VALUE} est non valide"]
    },
    mdp: {
        type: String,
        required: [true, "Le champ mot de passe est requis"],
        minlength: [8, "Le mot de passe doit contenir 8 caractères au moins"],
        select: false
    },
    mdpConfirm: {
        type: String,
        required: [true, "Veuillez confirmer votre mot de passe !!!"],
        validate: {
            validator: function (v) {
                return v === this.mdp
            },
            message: "Les mots de passes ne correspondent pas"
        }
    },
    avatar: {
        type: String,
        default: "avatar.png"
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user'
    },
    actif: {
        type: Boolean,
        default: true,
        select: false
    }
}, {timestamps: true, toJSON: {virtuals: true}});

// On cree un getter age pour le model
UserSchema.virtual('age').get(function () {
    return appUtils.calculAge(this.ddn);
});

// Fonction de rappel avant une persistence permettant de capitaliser le champ prenom & hasher le champ mdp
UserSchema.pre('save', async function (next) {

    // On capitaliser le prenom
    this.prenom = appUtils.capitalizeWord(this.prenom);

    // Si le mot de passe existe deja et n'a pas été modifié
    if (!this.isModified('mdp')) {
        return next();
    }

    // Sinon on hash le mot de passe
    this.mdp = await bcrypt.hash(this.mdp, 12);

    // On désactive la persistence du champ confirmMdp
    this.mdpConfirm = undefined;
    next();
});

// Fonction de rappel avant une selection permettant de ne selectionner que les Users actifs
UserSchema.pre('/^find', async function (next) {
    await this.find({actif: {$ne: false}});
    next();
});

// Permet de verifier la conformité des mots de passes
UserSchema.methods.verifyMdp = async function (mdpCandidat, userMdp) {
    return await bcrypt.compare(mdpCandidat, userMdp);
}

UserSchema.plugin(beautifyUnique);
const User = mongoose.model('User', UserSchema);
module.exports = User;
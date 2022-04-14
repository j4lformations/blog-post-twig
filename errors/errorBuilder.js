// Crée par Joachim Zadi le 11/04/2022 à 15:35. Version 1.0
// ========================================================
const createError = require("http-errors");

const gestionErreur = (error) => {
    // Si le nom de l'erreur est du CastError
    if (error.name === 'CastError') {
        error.message = `Conversion invalide sur l'objet {${error.path}:${error.value}}`;
        return error;
    }

    // Si le code d'erreur est 11000 ==> Violation d'une contarinte d'unicité
    if (error.code === 11000) {
        error.message = `Vous tentatez de dupliquer le champ ${Object.keys(error.keyPattern).toString()}. Veuillez renseigner une autre valeur !`;
        return error;
    }

    // Si le nom de l'erreur est ValidationError
    if (error.name === 'ValidationError') {
        error.errors = Object.values(error.errors).map(e => e.message);
        error.message = error.errors.join('. ');
        return error;
    }
}

module.exports = gestionErreur;
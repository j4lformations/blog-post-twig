// Crée par Joachim Zadi le 11/04/2022 à 15:35. Version 1.0
// ========================================================

const gestionErreur = (error) => {
    // Le tableau d'erreurs
    let tabErreur = [];

    // Si le nom de l'erreur est du CastError
    if (error.name === 'CastError') {
        const erreur = {};
        erreur.path = `${error.path}`;
        erreur.message = `Conversion invalide sur la valeur ${error.value}`;
        tabErreur.push(erreur);
        error.errors = tabErreur;
        return error;
    }

    // Si le code d'erreur est 11000 ==> Violation d'une contrainte d'unicité
    if (error.code === 11000) {
        const erreur = {};
        erreur.path = `${Object.keys(error.keyPattern).toString()}`;
        erreur.message = `${error.keyValue[Object.keys(error.keyPattern).toString()]} est déja utilisé!`;
        tabErreur.push(erreur);
        error.errors = tabErreur;
        return error;
    }

    // Si le nom de l'erreur est ValidationError
    if (error.name === 'ValidationError') {
        error.errors = Object.values(error.errors).map(e => {
            const erreur = {};
            erreur.path = e.path;
            erreur.message = e.message;
            tabErreur.push(erreur);
        });
        error.errors = tabErreur;
        return error;
    }
}

module.exports = gestionErreur;
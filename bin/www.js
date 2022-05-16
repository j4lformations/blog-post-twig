// Crée par Joachim Zadi le 08/04/2022 à 18:31. Version 1.0
// ========================================================
const app = require('../app');
const hostname = process.env.HOSTNAME || 'localhost';
const port = process.env.PORT || 9095;

app.listen(port, hostname, () => {
    console.log(`Application disponible à l'adresse http://${hostname}:${port}`);
});

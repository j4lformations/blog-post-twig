// Crée par Joachim Zadi le 08/04/2022 à 18:31. Version 1.0
// ========================================================
const app = require('../app');
const port = process.env.PORT || 7500;

app.listen(port, ()=>{
    console.log(`Application disponible à l'adresse http://localhost:${port}`);
});

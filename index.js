const express = require("express")
const app = express()
const bodyParser = require('body-parser')
const cors = require("cors");
const mongoose = require("mongoose")
app.use(cors());

const { routerTransporteur } = require("./Routes/transporteurRoute")
const { routerTypeDepartement } = require("./Routes/typeDepartementRoute");
const { routerTaxe } = require("./Routes/taxeRoute");
const { routerTypeCompteur } = require("./Routes/typeCompteurRoute");
const { routerFamilleProduit } = require("./Routes/familleProduitRoute");

const { routerTypePlat } = require("./Routes/typePlatRoute");

const { routerFamille } = require("./Routes/famillesRoute")



const { routerUtilisateur } = require("./Routes/utilisateurRoute");
const { routerParametre } = require("./Routes/parametreRoute");
const { routerReclamation } = require("./Routes/etat-reclamationRoute");


const { routerTypeEquipement } = require("./Routes/type-equipementRoute");
const { routerDocumentation } = require("./Routes/DocumentationRoute");
const { routerMarque } = require("./Routes/MarqueRoute");
const { routerUnite } = require("./Routes/UniteRoute");
const { routerSpecialite } = require("./Routes/SpecialiteRoute");
const { routerFonction } = require("./Routes/FonctionRoute");
const { routerUser } = require("./Routes/userRoute");








mongoose.connect("mongodb://localhost/shopBD", { useUnifiedTopology: true, useNewUrlParser: true })
    .then(console.log("connected to mongodb"))
    .catch(err => console.log(err))

/*mongoose.connect("mongodb://localhost/shopBD", { useUnifiedTopology: true, useNewUrlParser: true, username: "JR-Test", password: "test" })
.then(console.log("connected to mongodb"))
.catch(err => console.log(err))*/

app.use(express.json())

/*var allowCrossDomain = function(req, res, next) {
	console.log("Bonjour")
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
	res.header('Access-Control-Allow-Headers', 'Content-Type');

	next();
}*/
const authroute = require('./Routes/auth')
app.use('/api/user', authroute);
//app.use(cors());
//app.use(allowCrossDomain);
app.use('/user', routerUser)
app.use('/documentation', routerDocumentation)
app.use('/typeequipement', routerTypeEquipement)
app.use('/familles', routerFamille)
app.use('/utilisateur', routerUtilisateur)
app.use('/reclamations', routerReclamation)
app.use('/transporteurs', routerTransporteur)
app.use('/parametres', routerParametre)
app.use('/typeDepartements', routerTypeDepartement)
app.use('/specialites', routerSpecialite)
    //app.use('/utilisateurs', routerUtilisateur)
app.use('/unites', routerUnite)
app.use('/transporteurs', routerTransporteur)
app.use('/marques', routerMarque)
app.use('/taxe', routerTaxe)
app.use('/typeCompteurs', routerTypeCompteur)
app.use('/FamilleProduits', routerFamilleProduit)
app.use('/TypePlats', routerTypePlat)
    //app.use('/images',express.static(path.join('images')))
app.use('/fonctions', routerFonction)
app.use(bodyParser.urlencoded({ extended: false }));
app.use(express.static('images'));

app.use('/images', express.static(__dirname + '/images/'));

// app.listen(4000,() => {
//     console.log("here is console for backend")
// })


app.use(express.static('fichiers'));

app.use('/fichiers', express.static(__dirname + '/fichiers/'));

/*app.all('*', function (req, res) {
	res.sendFile(__dirname + "/public/index.html");
});*/

app.listen(process.env.PORT || 4000, () => {
    console.log("server conected to port 4000")
})
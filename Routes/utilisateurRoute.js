const { Utilisateur, validateUtilisateur, validateNewPassowrd, validateLogin, validateModifierMotPasse } = require('../Models/utilisateurModel')
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var multer = require('multer');
const fs = require('fs');

var dateFormat = require('dateformat');



var ObjectId = require('mongodb').ObjectID;

const { getMaxListeners } = require('process');


var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads')
    },
    filename: function(req, file, cb) {
        cb(null, file.originalname + Date.now())
    }
})


var upload = multer({ storage: storage })

router.post('/upload', upload.array('myFiles'), async(req, res) => {
    const files = req.files
    let arr = [];
    files.forEach(element => {

        arr.push(element.path)

    })
    return res.send(arr)
})


router.post('/newUtilisateur', async(req, res) => {

    console.log('test')
        // req.body.societeRacine = await getSocieteRacine(ObjectId(req.body.societe))

    const emailExist = await Utilisateur.findOne({ email: req.body.email });
    if (emailExist) return res.send({ status: false, message: 'Votre email est déjà existé' })

    const loginExist = await Utilisateur.findOne({ login: req.body.login });
    if (loginExist) return res.send({ status: false, message: 'Votre login est déjà existé' })

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    const utilisateur = new Utilisateur({
        nom: req.body.nom,
        prenom: req.body.prenom,
        // telephone: req.body.telephone,
        // adresse: req.body.adresse,
        // role: req.body.role,
        email: req.body.email,
        login: req.body.login,
        password: hashPassword,
        //societeRacine: req.body.societeRacine,
    })

    var result = await utilisateur.save()

    result.password = undefined


    return res.send({ status: true, resultat: result })
})



router.post('/modifierUtilisateur/:id', verifytoken, async(req, res) => {


    const users = await Utilisateur.find({ _id: req.params.id })
    const user = users[0]


    if (users.length == 0) return res.send({ status: false, message: "Votre utilisateur n'existe pas" });

    if (req.body.email != null && req.body.email != "") {
        const users2 = await Utilisateur.find({ email: req.body.email })
        if (users2.length > 0 && user.email != req.body.email) return res.send({ status: false, message: 'Votre email est déjà existé' });
    }

    if (req.body.login != null && req.body.login != "") {
        const users2 = await Utilisateur.find({ login: req.body.login })
        if (users2.length > 0 && user.login != req.body.login) return res.send({ status: false, message: 'Votre login est déjà existé' });
    }

    var result = await Utilisateur.findByIdAndUpdate(user.id, {
        nom: req.body.nom,
        prenom: req.body.prenom,
        telephone: req.body.telephone,
        adresse: req.body.adresse,
        role: req.body.role,
        email: req.body.email,
        login: req.body.login,
    })

    return res.send({ status: true, resultat: result })

})

router.post('/modifierMotDePasseUtilisateur/:id', verifytoken, async(req, res) => {


    const users = await Utilisateur.find({ _id: req.params.id })
    const user = users[0]

    if (users.length == 0) return res.send({ status: false, message: 'errorUpdateUtilisateur1' });

    const salt = await bcrypt.genSalt(10);
    const hashPassword = await bcrypt.hash(req.body.password, salt);

    var result = await Utilisateur.findByIdAndUpdate(user.id, {
        password: hashPassword,
    })

    return res.send({ status: true, resultat: result })
})

router.post('/deleteUtilisateur/:id', verifytoken, async(req, res) => {


    const utilisateur = await Utilisateur.findById(req.params.id)

    if (!utilisateur) return res.status(401).send({ status: false })


    if (await Utilisateur.findOneAndDelete({ _id: req.params.id })) {
        return res.send({ status: true })
    } else {
        return res.send({ status: false })
    }

})


const myCustomLabels = {
    totalDocs: 'itemCount',
    docs: 'itemsList',
    limit: 'perPage',
    page: 'currentPage',
    nextPage: 'next',
    prevPage: 'prev',
    totalPages: 'pageCount',
    pagingCounter: 'slNo',
    meta: 'paginator'
};




router.post('/listUtilisateurs', async(req, res) => {


    var societeRacine = await getSocieteRacine(ObjectId(req.body.societe))

    var sort = {}
    for (let key in req.body.orderBy) {
        if (Number(req.body.orderBy[key]) != 0) {
            sort[key] = req.body.orderBy[key]
        }
    }

    if (Object.keys(sort).length == 0) {
        sort = { createdAt: -1 }
    }

    var pipeline = []


    pipeline.push({ $match: { societeRacine: societeRacine } })


    pipeline.push({
        $lookup: {
            from: 'roles',
            let: { "role": "$role" },
            pipeline: [{
                $match: {
                    $expr: {
                        "$and": [
                            { "$eq": ["$_id", "$$role"] },
                        ]
                    }
                }
            }],
            as: "roles"
        }
    })

    pipeline.push({
        $set: {
            role: { $arrayElemAt: ["$roles.libelle", 0] },
            id: "$_id",
        }
    })

    pipeline.push({
        $project: { id: 1, role: 1, prenom: 1, nom: 1, email: 1, adresse: 1, telephone: 1 }
    })

    var search = req.body.search

    for (let key in search) {

        if (search[key] != "") {
            var word1 = search[key].charAt(0).toUpperCase() + search[key].slice(1)
            var word2 = search[key].toUpperCase()
            var word3 = search[key].toLowerCase()


            var objet1 = {}
            objet1[key] = { $regex: '.*' + word1 + '.*' }

            var objet2 = {}
            objet2[key] = { $regex: '.*' + word2 + '.*' }

            var objet3 = {}
            objet3[key] = { $regex: '.*' + word3 + '.*' }

            let objectMatch = { $or: [objet1, objet2, objet3] }

            let objectParent = { $match: objectMatch }
            pipeline.push(objectParent)
        }
    }


    var sommePipeline = []
    for (let key in pipeline) {
        sommePipeline.push(pipeline[key])
    }

    pipeline.push({
        $sort: sort
    })

    var skip = Number(req.body.page - 1) * Number(req.body.limit)

    pipeline.push({ $limit: skip + Number(req.body.limit) })

    pipeline.push({ $skip: skip })

    const articles = await Utilisateur.aggregate(pipeline)

    sommePipeline.push({
        $count: "total"
    })


    var nbrTotal = await Utilisateur.aggregate(sommePipeline)

    if (nbrTotal.length == 0) {
        nbrTotal = [{ total: 0 }]
    }

    const nbrTotalTrunc = Math.trunc(nbrTotal[0].total / req.body.limit)
    var pages = nbrTotal[0].total / req.body.limit

    if (pages > nbrTotalTrunc) {
        pages = nbrTotalTrunc + 1
    }

    const result = { docs: articles, pages: pages }

    return res.send({ status: true, resultat: result, request: req.body })

})




router.get('/getById/:id', verifytoken, async(req, res) => {

    if (req.params.id == undefined || req.params.id == null || req.params.id == "") return res.status(400).send({ status: false })

    const utilisateur = await Utilisateur.findOne({ _id: req.params.id })

    return res.send({ status: true, resultat: utilisateur })

})


router.post('/login', async(req, res) => {


    var user = await Utilisateur.findOne({ $or: [{ email: req.body.email }, { login: req.body.email }] });

    //var user2 = await Utilisateur.findOne({ $or: [{ email: req.body.email }, { login: req.body.email }] }).populate('role');

    if (!user) return res.send({ status: false, message: 'errorLogin' });

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.send({ status: false, message: 'errorLogin' })

    if (user.codeForgotPassword.length > 1) {
        const result = await User.findByIdAndUpdate(user.id, {
            codeForgotPassword: ""
        })
    }

    user.password = undefined

    jwt.sign({ user }, 'secretkey', (err, token) => {
        res.json({ status: true, token: token, user: user });
    });

})

router.post('/loginAdmin', async(req, res) => {

    const users = await User.find({});

    if (users.length == 0) {
        const salt = await bcrypt.genSalt(10);
        const hashPassword = await bcrypt.hash(req.body.password, salt);

        var user = new User({ email: req.body.email, password: hashPassword, codeForgotPassword: "" })
        var user = await user.save()
        user.password = undefined

        jwt.sign({ user }, 'secretkey', (err, token) => {
            res.json({ status: true, token: token, user: user });
        });
    }

    var user = await User.findOne({ email: req.body.email });

    if (!user) return res.send({ status: false, message: 'errorLogin' });

    const validPass = await bcrypt.compare(req.body.password, user.password);
    if (!validPass) return res.send({ status: false, message: 'errorLogin' })

    if (user.codeForgotPassword.length > 1) {
        const result = await User.findByIdAndUpdate(user.id, {
            codeForgotPassword: ""
        })
    }

    user.password = undefined

    jwt.sign({ user }, 'secretkey', (err, token) => {
        res.json({ status: true, token: token, user: user });
    });

})

router.post('/newPassword', async(req, res) => {

    const { error } = validateNewPassowrd(req.body)
    if (error) return res.status(400).send({ status: false, message: error.details[0].message })

    if (req.body.code.length < 10) {
        return res.send({ status: false });
    }

    const user = await Utilisateur.findOne({ codeForgotPassword: req.body.code });
    if (user == null) return res.send({ status: false });

    var hashPassword = ""
    const salt = await bcrypt.genSalt(10);
    hashPassword = await bcrypt.hash(req.body.newPassword, salt);

    const result = await Utilisateur.findByIdAndUpdate(user.id, {
        password: hashPassword,
        codeForgotPassword: ""
    })

    return res.send({ status: true })
})

router.post('/getAllParametres', verifytoken, async(req, res) => {

    var societeRacine = await getSocieteRacine(ObjectId(req.body.societe))

    const roles = await Role.find({ societeRacine: societeRacine })
    const utilisateurs = await Utilisateur.find({ societeRacine: societeRacine })
    return res.send({ status: true, roles: roles, utilisateurs: utilisateurs })
})

function verifytoken(req, res, next) {
    const bearerHeader = req.headers['authorization'];

    if (typeof bearerHeader !== 'undefined') {

        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        jwt.verify(bearerToken, 'secretkey', (err, authData) => {
            if (err) {
                res.sendStatus(403);
            } else {
                req.user = authData;
                next();
            }
        });

    } else {
        console.log("etape100");
        res.sendStatus(401);
    }

}

module.exports.routerUtilisateur = router
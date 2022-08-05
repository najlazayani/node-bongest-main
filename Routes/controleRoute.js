const { Controle, validateControle } = require('../Models/controleModel')
const express = require('express')
const router = express.Router()
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var multer = require('multer');
const fs = require('fs');

var dateFormat = require('dateformat');

var ObjectId = require('mongodb').ObjectID;


var storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'images')
    },
    filename: function(req, file, cb) {
        console.log(file);

        cb(null, Date.now() + file.originalname);
    }
})


var upload = multer({ storage: storage })

router.post('/', upload.single('file'), function(req, res, next) {
    if (!req.file) {
        return res.status(500).send({ message: 'Upload fail' });
    } else {
        req.body.imageUrl = 'http://192.168.0.7:4000/images/' + req.file.filename;
        Controle.create(req.body, function(err, controle) {
            if (err) {
                console.log(err);
                return next(err);
            }
            res.json(controle);
        });
    }
});

router.post('/images', upload.array('myFiles'), async(req, res) => {
    const files = req.files
    let arr = [];
    files.forEach(element => {
        arr.push(element.path)
    })
    return res.send(arr)
})




router.post('/newControle', async(req, res) => {

    var body = req.body

    const controle = new Controle(body);

    const result = await controle.save()

    return res.send({ status: true, resultat: result })
})




router.post('/modifierControle/:id', async(req, res) => {

    console.log("modifier", req.body);
    const controle = await Controle.findById(req.params.id)

    if (!controle) return res.status(401).send({ status: false })

    const result = await Controle.findOneAndUpdate({ _id: req.params.id }, req.body)

    const controle2 = await Controle.findById(req.params.id)
    console.log("test modifier");
    console.log(controle2);
    return res.send({ status: true, resultat: controle2 })
})



router.post('/deleteControle/:id', async(req, res) => {

    //if(req.user.user.role != "admin") return res.status(401).send({status:false})

    const controle = await Controle.findById(req.params.id)

    if (!controle) return res.status(401).send({ status: false })


    if (await Controle.findOneAndDelete({ _id: req.params.id })) {
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





router.post('/listControles', async(req, res) => {

    //if(req.user.user.role != "admin" ) return res.status(400).send({status:false})

    var sort = {}
    for (let key in req.body.orderBy) {
        if (Number(req.body.orderBy[key]) != 0) {
            sort[key] = req.body.orderBy[key]
        }
    }

    if (Object.keys(sort).length == 0) {
        sort = { createdAt: -1 }
    }

    var listFilter = []

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

            listFilter.push({ $or: [objet1, objet2, objet3] })
        }
    }

    const options = {
        page: Number(req.body.page),
        limit: Number(req.body.limit),
        customLabels: myCustomLabels,
        //populate: 'client'
        sort: sort
    };

    var result = []

    if (listFilter.length > 1) {
        result = await Controle.paginate({ $and: listFilter }, options)
    } else if (listFilter.length == 1) {
        result = await Controle.paginate(listFilter[0], options)
    } else {
        result = await Controle.paginate({}, options)
    }

    return res.send({ status: true, resultat: result, request: req.body })

})



router.get('/getById/:id', async(req, res) => {

    if (req.params.id == undefined || req.params.id == null || req.params.id == "") return res.status(400).send({ status: false })

    const controle = await Controle.findOne({ _id: req.params.id })

    return res.send({ status: true, resultat: controle })

})

router.get('/getAllParametres', async(req,res)=>{
    
    const controles = await Controle.find({})

    return res.send({ status: true, controles: controles })
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

module.exports.routerControle = router
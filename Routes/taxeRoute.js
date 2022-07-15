const {Taxe, validateTaxe} =require('../Models/taxeModel')
const express=require('express')
const router=express.Router()
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var multer = require('multer');
const fs = require('fs');

var dateFormat = require('dateformat');

var ObjectId = require('mongodb').ObjectID;



router.post('/newTaxe', async(req,res)=>{

    var body = req.body 

    
    const taxe=new Taxe(body);

    const result=await taxe.save()

    return res.send({status:true,resultat:result})
})


/**
 * @swagger
 * /transporteurs/modifierTransporteur/{id}:
 *   post:
 *     summary: Update the Transporteur by id
 *     tags: [Transporteurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Transporteur id

 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                nom:
 *                  type: string
 *                numVehicule:
 *                  type: number
 *                gsm:
 *                  type: string
 *                tel:
 *                  type: string
 *                email:
 *                  type: string
 *     responses:
 *       200:
 *         description: The list of the Transporteurs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 resultat:
 *                   type: object
 *                   properties:
 *                     nom:
 *                       type: string
 *                     numVehicule:
 *                       type: number
 *                     gsm:
 *                       type: string
 *                     tel:
 *                       type: string
 *                     email:
 *                       type: string
 *
 *
 */









router.post('/modifierTaxe/:id', async(req,res)=>{

    console.log("najla is in the backend");
    console.log(req.body);

    const taxe = await Taxe.findById(req.params.id)
    console.log(req.params.id);
    console.log("taxe");
    console.log(taxe);

    if(!taxe) {
        return 
         res.status(401).send({status:false})}
        
    const result = await Taxe.findOneAndUpdate({_id:req.params.id}, req.body)

     const taxe2 = await Taxe.findById(req.params.id);
     console.log(taxe2);

     return res.send({status:true,resultat:taxe2})})

/**
 * @swagger
 * /transporteurs/deleteTransporteur/{id}:
 *   post:
 *     summary: Remove the Transporteur by id
 *     tags: [Transporteurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Transporteur id
 *
 *     responses:
 *       200:
 *         description: The Transporteur was deleted
 *         content:
 *          application/json:
 *            schema:
 *               type: object
 *               properties:
 *                  status:
 *                    type: boolean
 *       404:
 *         description: The Transporteur was not found
 *       500:
 *         description: Some error happened
 */

router.post('/deleteTaxe/:id', async(req,res)=>{

    //if(req.user.user.role != "admin") return res.status(401).send({status:false})

    const taxe = await Taxe.findById(req.params.id)

    if(!taxe) return res.status(401).send({status:false})


    if(await Taxe.findOneAndDelete({_id:req.params.id})){
        return res.send({status:true})
    }else{
        return res.send({status:false})
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



/**
 * @swagger
 * /transporteurs/listTransporteurs:
 *   post:
 *     summary: Returns the list of all the Transporteurs
 *     tags: [Transporteurs]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *                page:
 *                  type: number
 *                limit:
 *                  type: number
 *                search:
 *                  type: object
 *                orderBy:
 *                  type: object
 *     responses:
 *       200:
 *         description: The list of the Transporteurs
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: boolean
 *                 request:
 *                   type: object
 *                   properties:
 *                      page:
 *                         type: number
 *                      limit:
 *                         type: number
 *                      search:
 *                         type: object
 *                      orderBy:
 *                         type: object
 *                 resultat:
 *                   type: object
 *                   properties:
 *                      total:
 *                         type: number
 *                      limit:
 *                         type: number
 *                      page:
 *                         type: number
 *                      pages:
 *                         type: number
 *                      docs:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                            id:
 *                              type: string
 *                            nom:
 *                              type: string
 *                            numVehicule:
 *                              type: number
 *                            gsm:
 *                              type: string
 *                            tel:
 *                              type: string
 *                            email:
 *                              type: string
 *                            order:
 *                              type: number
 *                            createdAt:
 *                              type: string
 *                            updatedAt:
 *                              type: string
 *
 *
 *
 */

 router.post('/listTaxe', async(req,res)=>{
  
    //if(req.user.user.role != "admin" ) return res.status(400).send({status:false})
  
    var sort = {}
    for( let key in req.body.orderBy){
        if(Number(req.body.orderBy[key]) != 0){
             sort[key] = req.body.orderBy[key]
        }  
    }

    if(Object.keys(sort).length == 0){
        sort = {createdAt:-1}
    }
   
    var listFilter =[]
    
    var search = req.body.search
    
    for( let key in search){
        if(search[key] != ""){
            var word1 = search[key].charAt(0).toUpperCase() + search[key].slice(1)
            var word2 = search[key].toUpperCase()
            var word3 = search[key].toLowerCase()
            var objet1 = {}
            objet1[key] = { $regex: '.*' + word1 + '.*' }
           
            var objet2 = {}
            objet2[key] = { $regex: '.*' + word2 + '.*' }
            
            var objet3 = {}
            objet3[key] = { $regex: '.*' + word3 + '.*' }

            listFilter.push({$or:[objet1, objet2, objet3]})
        }  
    }

    const options = {
        page: Number(req.body.page),
        limit: Number(req.body.limit),
        customLabels: myCustomLabels,
        //populate: 'client'
        sort:sort
    };

    var result = []
    
    if(listFilter.length > 1){
      result = await  Taxe.paginate({$and:listFilter}, options) 
    }else if(listFilter.length == 1){
      result = await  Taxe.paginate(listFilter[0], options)
    }else{
      result = await  Taxe.paginate({}, options)
    }

    return res.send({status:true, resultat:result, request:req.body})
    
})


/**
 * @swagger
 * /transporteurs/getById/{id}:
 *   get:
 *     summary: Remove the Transporteur by id
 *     tags: [Transporteurs]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The Transporteur id
 *
 *     responses:
 *       200:
 *         description: The Transporteur was deleted
 *         content:
 *          application/json:
 *            schema:
 *               type: object
 *               properties:
 *                  status:
 *                    type: boolean
 *                  resultat:
 *                    type: object
 *                    properties:
 *                     id:
 *                       type: string
 *                     nom:
 *                       type: string
 *                     numVehicule:
 *                       type: number
 *                     gsm:
 *                       type: string
 *                     tel:
 *                       type: string
 *                     email:
 *                       type: string
 *                     createdAt:
 *                       type: string
 *                     updatedAt:
 *                       type: string
 *       404:
 *         description: The Transporteur was not found
 *       500:
 *         description: Some error happened
 */
router.get('/getById/:id', async(req,res)=>{

    if(req.params.id == undefined || req.params.id == null || req.params.id == "") return res.status(400).send({status:false})

    const taxe = await Taxe.findOne({_id:req.params.id})

    return res.send({status:true,resultat:taxe})

})

router.get('/getAllParametres',  async(req,res)=>{
    
    const taxes = await Taxe.find({})
    
    return res.send({status:true, taxes:taxes}) 
})

function verifytoken(req, res, next){
    const bearerHeader = req.headers['authorization'];

    if(typeof bearerHeader !== 'undefined'){

        const bearer = bearerHeader.split(' ');
        const bearerToken = bearer[1];
        jwt.verify(bearerToken, 'secretkey', (err, authData) => {
            if(err){
                res.sendStatus(403);
            }else{
                req.user = authData;
                next();
            }
        });

    }else{
        console.log("etape100");
        res.sendStatus(401);
    }

}

module.exports.routerTaxe=router

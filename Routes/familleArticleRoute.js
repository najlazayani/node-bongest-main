const {FamilleArticle, validateFamilleArticle} =require('../Models/FamilleArticleModel')
const express=require('express')
const router=express.Router()
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var multer = require('multer');
const fs = require('fs');

var dateFormat = require('dateformat');

var ObjectId = require('mongodb').ObjectID;


router.post('/newFamilleArticle', async(req,res)=>{

    var body = req.body 

    
    const familleArticle=new FamilleArticle(body);

    const result=await familleArticle.save()

    return res.send({status:true,resultat:result})
})









router.post('/modifierFamilleArticle/:id', async(req,res)=>{

  

    const familleArticle = await FamilleArticle.findById(req.params.id)
  

    if(!familleArticle) {
        return 
         res.status(401).send({status:false})}
        
    const result = await FamilleArticle.findOneAndUpdate({_id:req.params.id}, req.body)

     const familleArticle2 = await FamilleArticle.findById(req.params.id);
    

     return res.send({status:true,resultat:familleArticle2})})


router.post('/deleteFamilleArticle/:id', async(req,res)=>{

    //if(req.user.user.role != "admin") return res.status(401).send({status:false})

    const familleArticle = await FamilleArticle.findById(req.params.id)

    if(!familleArticle) return res.status(401).send({status:false})


    if(await FamilleArticle.findOneAndDelete({_id:req.params.id})){
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



 router.post('/listFamilleArticle', async(req,res)=>{
  
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
      result = await  FamilleArticle.paginate({$and:listFilter}, options) 
    }else if(listFilter.length == 1){
      result = await  FamilleArticle.paginate(listFilter[0], options)
    }else{
      result = await  FamilleArticle.paginate({}, options)
    }

    return res.send({status:true, resultat:result, request:req.body})
    
})



router.get('/getById/:id', async(req,res)=>{

    if(req.params.id == undefined || req.params.id == null || req.params.id == "") return res.status(400).send({status:false})

    const familleArticle = await FamilleArticle.findOne({_id:req.params.id})

    return res.send({status:true,resultat:familleArticle})

})

router.get('/getAllParametres', async(req,res)=>{
    
    const familleArticles = await FamilleArticle.find({})
    
    return res.send({status:true, familleArticles:familleArticles}) 
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

module.exports.routerFamilleArticle=router
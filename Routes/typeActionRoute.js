const {TypeAction, validateTypeAction} =require('../Models/typeActionModel')
const express=require('express')
const router=express.Router()
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
var multer = require('multer');
const fs = require('fs');

var dateFormat = require('dateformat');
const { Plat } = require('../Models/platModel');

var ObjectId = require('mongodb').ObjectID;



router.post('/newTypeAction', verifytoken,async(req,res)=>{

    var body = req.body 

    
    const typeAction=new TypeAction(body);

    const result=await typeAction.save()

    return res.send({status:true,resultat:result})
})









router.post('/modifierTypeAction/:id', verifytoken,async(req,res)=>{

    console.log(req.body);

    const typeAction = await TypeAction.findById(req.params.id)
    

    if(!typeAction) {
        return 
         res.status(401).send({status:false})}
        
    const result = await TypeAction.findOneAndUpdate({_id:req.params.id}, req.body)

     const typeAction2 = await TypeAction.findById(req.params.id);
     console.log(typeAction2);

     return res.send({status:true,resultat:typeAction2})})



router.post('/deleteTypeAction/:id',verifytoken, async(req,res)=>{

    //if(req.user.user.role != "admin") return res.status(401).send({status:false})

    const typeAction = await TypeAction.findById(req.params.id)
const plats = await Plat.find({typeAction:typeAction.id})
//console.log("plats for delete")
//console.log(plats);
   
    if(!typeAction) return res.status(401).send({status:false})


    if(await TypeAction.findOneAndDelete({_id:req.params.id})){
        for (let key in plats) {
            //console.log("plats id for delete")
            //console.log(plats[key].id);
            if(await Plat.findOneAndDelete({_id:plats[key].id})){
                return res.send({status:true})
            }else{
                return res.send({status:false})
            }
          }
          
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





 router.post('/listTypeAction', verifytoken,async(req,res)=>{
  
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
      result = await  TypeAction.paginate({$and:listFilter}, options) 
    }else if(listFilter.length == 1){
      result = await  TypeAction.paginate(listFilter[0], options)
    }else{
      result = await  TypeAction.paginate({}, options)
    }

    return res.send({status:true, resultat:result, request:req.body})
    
})



router.get('/getById/:id', verifytoken,async(req,res)=>{

    if(req.params.id == undefined || req.params.id == null || req.params.id == "") return res.status(400).send({status:false})

    const typeAction = await TypeAction.findOne({_id:req.params.id})

    return res.send({status:true,resultat:typeAction})

})

router.get('/getAllParametres',verifytoken,  async(req,res)=>{
    
    const typeActions = await TypeAction.find({})
    
    return res.send({status:true, typeActions:typeActions}) 
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

module.exports.routerTypeAction=router

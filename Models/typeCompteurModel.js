const mongoose=require('mongoose')
const Joi=require('joi')
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema
const Schema1 = mongoose.Schema
const schemaTypeCompteur=mongoose.Schema({
    libelle:{type:String,default: ""},
    ordre:{type:Number,default: ""},
    couleur:{type:String,default: ""},
    imagePath:{type:String,default:""}
   
},
{ timestamps: true }
)

schemaTypeCompteur.plugin(mongoosePaginate);

schemaTypeCompteur.method("toJSON", function() {
const { __v, _id, ...object } = this.toObject();
object.id = _id;
return object;
});

const TypeCompteur = mongoose.model('TypeCompteur',schemaTypeCompteur)

function validateTypeCompteur(TypeCompteur){
let schema = Joi.object({
    libelle:Joi.string().allow('', null),
    ordre:Joi.string().allow('', null),
    couleur:Joi.string().allow('', null),
    imagePath:Joi.string().allow('', null)
    
})
return schema.validate(TypeCompteur)
}
module.exports.TypeCompteur=TypeCompteur
module.exports.validateTypeCompteur=validateTypeCompteur
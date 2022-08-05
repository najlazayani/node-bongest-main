const mongoose=require('mongoose')
const Joi=require('joi')
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema
const Schema1 = mongoose.Schema

const schemaEtatDemandeAchat=mongoose.Schema({
        libelle:{type:String,default: ""},
        couleur:{type:String,default: 0}
  
    },
    { timestamps: true }
)

schemaEtatDemandeAchat.plugin(mongoosePaginate);

schemaEtatDemandeAchat.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const EtatDemandeAchat = mongoose.model('EtatDemandeAchat',schemaEtatDemandeAchat)

function validateEtatDemandeAchat(EtatDemandeAchat){
    let schema = Joi.object({
        libelle:Joi.string().allow('', null),
        couleur:Joi.string().allow('', null)
        
    })
    return schema.validate(EtatDemandeAchat)
}
module.exports.EtatDemandeAchat=EtatDemandeAchat
module.exports.validateEtatDemandeAchat=validateEtatDemandeAchat

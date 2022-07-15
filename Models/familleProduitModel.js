const mongoose=require('mongoose')
const Joi=require('joi')
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema
const Schema1 = mongoose.Schema

const schemaFamilleProduit=mongoose.Schema({
        libelle:{type:String,default: ""},
        prefixe:{type:String,default: 0}
  
    },
    { timestamps: true }
)

schemaFamilleProduit.plugin(mongoosePaginate);

schemaFamilleProduit.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const FamilleProduit = mongoose.model('FamilleProduit',schemaFamilleProduit)

function validateFamilleProduit(FamilleProduit){
    let schema = Joi.object({
        libelle:Joi.string().allow('', null),
        prefixe:Joi.string().allow('', null)
        
    })
    return schema.validate(FamilleProduit)
}
module.exports.FamilleProduit=FamilleProduit
module.exports.validateFamilleProduit=validateFamilleProduit

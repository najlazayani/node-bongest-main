const mongoose=require('mongoose')
const Joi=require('joi')
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema
const Schema1 = mongoose.Schema

const schemaFamilleArticle=mongoose.Schema({
        libelle:{type:String,default: ""},
        prefixe:{type:String,default: 0}
  
    },
    { timestamps: true }
)

schemaFamilleArticle.plugin(mongoosePaginate);

schemaFamilleArticle.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const FamilleArticle = mongoose.model('FamilleArticle',schemaFamilleArticle)

function validateFamilleArticle(FamilleArticle){
    let schema = Joi.object({
        libelle:Joi.string().allow('', null),
        prefixe:Joi.string().allow('', null)
        
    })
    return schema.validate(FamilleArticle)
}
module.exports.FamilleArticle=FamilleArticle
module.exports.validateFamilleArticle=validateFamilleArticle

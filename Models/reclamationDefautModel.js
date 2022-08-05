const mongoose=require('mongoose')
const Joi=require('joi')
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema
const Schema1 = mongoose.Schema

const schemaReclamationDefaut=mongoose.Schema({
        libelle:{type:String,default: ""}
        
  
    },
    { timestamps: true }
)

schemaReclamationDefaut.plugin(mongoosePaginate);

schemaReclamationDefaut.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const ReclamationDefaut = mongoose.model('ReclamationDefaut',schemaReclamationDefaut)

function validateReclamationDefaut(ReclamationDefaut){
    let schema = Joi.object({
        libelle:Joi.string().allow('', null)
    
        
    })
    return schema.validate(ReclamationDefaut)
}
module.exports.ReclamationDefaut=ReclamationDefaut
module.exports.validateReclamationDefaut=validateReclamationDefaut

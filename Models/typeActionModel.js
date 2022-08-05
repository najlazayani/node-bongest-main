const mongoose=require('mongoose')
const Joi=require('joi')
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema
const Schema1 = mongoose.Schema

const schemaTypeAction=mongoose.Schema({
        libelle:{type:String,default: ""}
        
  
    },
    { timestamps: true }
)

schemaTypeAction.plugin(mongoosePaginate);

schemaTypeAction.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const TypeAction = mongoose.model('TypeAction',schemaTypeAction)

function validateTypeAction(TypeAction){
    let schema = Joi.object({
        libelle:Joi.string().allow('', null)
    
        
    })
    return schema.validate(TypeAction)
}
module.exports.TypeAction=TypeAction
module.exports.validateTypeAction=validateTypeAction

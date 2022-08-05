const mongoose=require('mongoose')
const Joi=require('joi')
const mongoosePaginate = require('mongoose-paginate');
const { string } = require('joi');

const Schema = mongoose.Schema
const Schema1 = mongoose.Schema

const schemaControle=mongoose.Schema({
        libelle:{type:String,default: ""},

        imagePath: { type: String, default: "" },
        tempExecution:{type:Number, default:0},
        type :{type: String,default: ""}
    
        
  
    },
    { timestamps: true }
)

schemaControle.plugin(mongoosePaginate);

schemaControle.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const Controle = mongoose.model('Controle',schemaControle)

function validateControle(Controle){
    let schema = Joi.object({
        libelle:Joi.string().allow('', null),
        imagePath: Joi.string().allow('', null),
        tempExecution:Joi.string().allow('', null),
        type:Joi.string().allow('', null),
        
    })
    return schema.validate(Controle)
}
module.exports.Controle=Controle
module.exports.validateControle=validateControle

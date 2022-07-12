const mongoose=require('mongoose')
const Joi=require('joi')
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema
const Schema1 = mongoose.Schema

const schemaTypePlat=mongoose.Schema({
        libelle:{type:String,default: ""}
        
  
    },
    { timestamps: true }
)

schemaTypePlat.plugin(mongoosePaginate);

schemaTypePlat.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const TypePlat = mongoose.model('TypePlat',schemaTypePlat)

function validateTypePlat(TypePlat){
    let schema = Joi.object({
        libelle:Joi.string().allow('', null)
    
        
    })
    return schema.validate(TypePlat)
}
module.exports.TypePlat=TypePlat
module.exports.validateTypePlat=validateTypePlat

const mongoose=require('mongoose')
const Joi=require('joi')
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema
const Schema1 = mongoose.Schema

const schemaPlat=mongoose.Schema({
        libelle:{type:String,default: ""},
        typePlat:{type:String,default: 0}
  
    },
    { timestamps: true }
)

schemaPlat.plugin(mongoosePaginate);

schemaPlat.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const Plat = mongoose.model('Plat',schemaPlat)

function validatePlat(Plat){
    let schema = Joi.object({
        libelle:Joi.string().allow('', null),
        typePlat:Joi.string().allow('', null)
        
    })
    return schema.validate(Plat)
}
module.exports.Plat=Plat
module.exports.validatePlat=validatePlat

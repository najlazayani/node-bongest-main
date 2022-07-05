const mongoose=require('mongoose')
const Joi=require('joi')
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema
const Schema1 = mongoose.Schema

const schemaTaxe=mongoose.Schema({
        taux:{type:Number,default:0},
        
    },
    { timestamps: true }
)

schemaTaxe.plugin(mongoosePaginate);

schemaTaxe.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const Taxe = mongoose.model('Taxe',schemaTaxe)

function validateTaxe(Taxe){
    let schema = Joi.object({
        taux:Joi.string().allow('', null),
        
    })
    return schema.validate(Taxe)
}
module.exports.Taxe=Taxe
module.exports.validateTaxe=validateTaxe
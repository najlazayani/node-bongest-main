const mongoose=require('mongoose')
const Joi=require('joi')
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema
const Schema1 = mongoose.Schema

const schemaServiceBt=mongoose.Schema({
        libelle:{type:String,default: ""}
        
  
    },
    { timestamps: true }
)

schemaServiceBt.plugin(mongoosePaginate);

schemaServiceBt.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const ServiceBt = mongoose.model('ServiceBt',schemaServiceBt)

function validateServiceBt(ServiceBt){
    let schema = Joi.object({
        libelle:Joi.string().allow('', null)
    
        
    })
    return schema.validate(ServiceBt)
}
module.exports.ServiceBt=ServiceBt
module.exports.validateServiceBt=validateServiceBt

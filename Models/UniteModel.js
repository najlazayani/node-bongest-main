const mongoose = require('mongoose')
const Joi = require('joi')
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema
const Schema1 = mongoose.Schema

const schemaUnite = mongoose.Schema({
    libelle: { type: String, default: "" },

}, { timestamps: true })

schemaUnite.plugin(mongoosePaginate);

schemaUnite.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const Unite = mongoose.model('Unite', schemaUnite)

function validateUnite(Unite) {
    let schema = Joi.object({
        libelle: Joi.string().allow('', null),

    })
    return schema.validate(Unite)
}
module.exports.Unite = Unite
module.exports.validateUnite = validateUnite
const mongoose = require('mongoose')
const Joi = require('joi')
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema
const Schema1 = mongoose.Schema

const schemaMarque = mongoose.Schema({
    libelle: { type: String, default: "" },

}, { timestamps: true })

schemaMarque.plugin(mongoosePaginate);

schemaMarque.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const Marque = mongoose.model('Marque', schemaMarque)

function validateMarque(Marque) {
    let schema = Joi.object({
        libelle: Joi.string().allow('', null),

    })
    return schema.validate(Marque)
}
module.exports.Marque = Marque
module.exports.validateMarque = validateMarque
const mongoose = require('mongoose')
const Joi = require('joi')
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema
const Schema1 = mongoose.Schema

const schemaFonction = mongoose.Schema({
    libelle: { type: String, default: "" },
    energie: { type: Boolean, default: "" },

}, { timestamps: true })

schemaFonction.plugin(mongoosePaginate);

schemaFonction.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const Fonction = mongoose.model('Fonction', schemaFonction)

function validateFonction(Fonction) {
    let schema = Joi.object({
        libelle: Joi.string().allow('', null),
        energie: Joi.boolean().allow('', null),

    })
    return schema.validate(Fonction)
}
module.exports.Fonction = Fonction
module.exports.validateFonction = validateFonction
const mongoose = require('mongoose')
const Joi = require('joi')
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema
const Schema1 = mongoose.Schema

const schemaParametre = mongoose.Schema({
    nom_parametre: { type: String, default: "" },
    valeur: { type: String, default: "" },

}, { timestamps: true })

schemaParametre.plugin(mongoosePaginate);

schemaParametre.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const Parametre = mongoose.model('Parametre', schemaParametre)

function validateParametre(Parametre) {
    let schema = Joi.object({
        nom_parametre: Joi.string().allow('', null),
        valeur: Joi.string().allow('', null),

    })
    return schema.validate(Parametre)
}
module.exports.Parametre = Parametre
module.exports.validateParametre = validateParametre
const mongoose = require('mongoose')
const Joi = require('joi')
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema
const Schema1 = mongoose.Schema

const schemaFamille = mongoose.Schema({
    libelle: { type: String, default: "" },

}, { timestamps: true })

schemaFamille.plugin(mongoosePaginate);

schemaFamille.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const Famille = mongoose.model('Famille', schemaFamille)

function validateFamille(Famille) {
    let schema = Joi.object({
        libelle: Joi.string().allow('', null),

    })
    return schema.validate(Famille)
}
module.exports.Famille = Famille
module.exports.validateFamille = validateFamille
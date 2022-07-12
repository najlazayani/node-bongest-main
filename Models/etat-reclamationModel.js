const mongoose = require('mongoose')
const Joi = require('joi')
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema
const Schema1 = mongoose.Schema

const schemaReclamation = mongoose.Schema({
    libelle: { type: String, default: "" },
    couleur: { type: String, default: "" },
}, { timestamps: true })

schemaReclamation.plugin(mongoosePaginate);

schemaReclamation.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const Reclamation = mongoose.model('Reclamation', schemaReclamation)

function validateReclamation(Reclamation) {
    let schema = Joi.object({
        libelle: Joi.string().allow('', null),
        couleur: Joi.string().allow('', null),
    })
    return schema.validate(Reclamation)
}
module.exports.Reclamation = Reclamation
module.exports.validateReclamation = validateReclamation
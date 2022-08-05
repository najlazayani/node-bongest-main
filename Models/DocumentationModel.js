const mongoose = require('mongoose')
const Joi = require('joi')
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema
const Schema1 = mongoose.Schema

const schemaDocumentation = mongoose.Schema({
    libelle: { type: String, default: "" },
    nature: { type: String, default: "" },
    fichier: { type: String, default: "" }

}, { timestamps: true })

schemaDocumentation.plugin(mongoosePaginate);

schemaDocumentation.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const Documentation = mongoose.model('Documentation', schemaDocumentation)

function validateDocumentation(Documentation) {
    let schema = Joi.object({
        libelle: Joi.string().allow('', null),
        nature: Joi.string().allow('', null),
        fichier: Joi.string().allow('', null)

    })
    return schema.validate(Documentation)
}
module.exports.Documentation = Documentation
module.exports.validateDocumentation = validateDocumentation
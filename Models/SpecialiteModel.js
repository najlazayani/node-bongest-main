const mongoose = require('mongoose')
const Joi = require('joi')
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema
const Schema1 = mongoose.Schema

const schemaSpecialite = mongoose.Schema({
    libelle: { type: String, default: "" },

}, { timestamps: true })

schemaSpecialite.plugin(mongoosePaginate);

schemaSpecialite.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const Specialite = mongoose.model('Specialite', schemaSpecialite)

function validateSpecialite(Specialite) {
    let schema = Joi.object({
        libelle: Joi.string().allow('', null),

    })
    return schema.validate(Specialite)
}
module.exports.Specialite = Specialite
module.exports.validateSpecialite = validateSpecialite
const mongoose = require('mongoose')
const Joi = require('joi')
const mongoosePaginate = require('mongoose-paginate');

const Schema = mongoose.Schema
const Schema1 = mongoose.Schema

const schemaTypeEquipement = mongoose.Schema({
    libelle: { type: String, default: "" },
    prefixe: { type: String, default: "" },
    pour: { type: String, default: "" },
    imagePath: { type: String, default: "" }

}, { timestamps: true })

schemaTypeEquipement.plugin(mongoosePaginate);

schemaTypeEquipement.method("toJSON", function() {
    const { __v, _id, ...object } = this.toObject();
    object.id = _id;
    return object;
});

const TypeEquipement = mongoose.model('TypeEquipement', schemaTypeEquipement)

function validateTypeEquipement(TypeEquipement) {
    let schema = Joi.object({
        libelle: Joi.string().allow('', null),
        imagePath: Joi.string().allow('', null),
        prefixe: Joi.string().allow('', null),
        pour: Joi.string().allow('', null)
    })
    return schema.validate(TypeEquipement)
}
module.exports.TypeEquipement = TypeEquipement
module.exports.validateTypeEquipement = validateTypeEquipement
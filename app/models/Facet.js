const mongoose = require("mongoose");
const uniqueValidator = require("mongoose-unique-validator");
const Schema = mongoose.Schema;

const facetSchema = Schema({

    id : { type: String, required: true},
    category :{ type: String, required: true, default:''},
    facetValue :{ type: [String], default:''} ,
    

});

facetSchema.plugin(uniqueValidator);

const Facet = mongoose.model('Facet', facetSchema);

module.exports = {
    Facet,
}
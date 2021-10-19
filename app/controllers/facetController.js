const User = require("../models/User");
const subscribe = require("./subscribe"); // subscribe
const bcrypt = require("bcrypt");
const {Facet} = require("../models/Facet")
/**
 * Le controlleur des facettes, qui est appeller par les routes et qui
 * utilise le model Facet
 */


/**
 * 
 * @param {*} req , la requête contient la catégorie souhaiter
 * @param {*} res , on renvoie la catégorie demandé
 */
exports.getFacetByCategory = async (req, res) => {

    Facet.find({category : req.param.category})
    .then((facet) =>{
        res.status(200).json(facet);
    })
    .catch((error) =>{
        res.status(400).json({
            error: error,
        });
    });
}

/**
 * 
 * @param {*} req pas de paramètre
 * @param {*} res renvoie la catégorie table
 */
exports.getTable = async (req, res) => {

    Facet.find({category : 'Table'})
    .then((facet) =>{
        res.status(200).json(facet);
    })
    .catch((error) =>{
        res.status(400).json({
            error: error,
        });
    });
}


/**
 * 
 * @param {*} req , pas de paramètre
 * @param {*} res , crée la catégori table 
 */
exports.addTable = async (req, res) => {

    let table = new Facet({id: 1, category: "Table", facetValue: ["Blanc","Bleu","Noir","Bois","Métal"]})
    table.save( function (err) {
    if (err) {
        res.status(400).json({ erreur: err.message});
        console.log(err);
    }
    else{
        res.status(200).json({table})
        console.log("Création");
    }
    });
}


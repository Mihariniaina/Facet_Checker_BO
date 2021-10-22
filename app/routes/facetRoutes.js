const express = require("express");
const router = express.Router();
const userCtrl = require("../controllers/user");
const subscribe = require("../controllers/subscribe"); // subscribe
const facetController = require("../controllers/facetController")


/**
 * Route d'appel pour le front dans le service et qui ensuite appele le controlleur
 */
router.get("/item",facetController.getFacetByCategory);
router.post("/ajouterTable", facetController.addTable );

module.exports = router;





const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const dbConfig = require("./config/database.config.js");
const mongoose = require("mongoose");
var cors = require('cors');

// Connecting to the database
mongoose
  .connect(dbConfig.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("Successfully connect to the database");
  })
  .catch((err) => {
    console.log("The server cannot connect to the database "+err);
    process.exit();
  });
  

app.use(function (req, res, next) {

 res.header("Access-Control-Allow-Origin", '*');
    res.header("Access-Control-Allow-Credentials", true);
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE,OPTIONS');
    res.header("Access-Control-Allow-Headers", 'Authorization, Origin,X-Requested-With,Content-Type,Accept,content-type,application/json');
    next();
});


// app.use(cors())
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

const userRoutes = require("./app/routes/user");
const facetRoute = require("./app/routes/facetRoutes")
//const routesA = require('../path/to/routesA/routes.js');
//const googleSearchRoutes = require("./app/routes/googleSearchRoutes");
//const ipetRoutes = require("./app/routes/ipeRoute");

app.options('*', cors()); 
app.use("/api/user", userRoutes);
app.use("/api/facet",facetRoute); // url for facet
//app.use("/api/search",googleSearchRoutes.router); 
//app.use("/api/ipe", ipetRoutes);

module.exports = app;

  
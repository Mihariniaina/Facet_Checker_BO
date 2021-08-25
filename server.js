// //---------------------------------------MEAN Test---------------------------------------------
const http = require("http");
const app = require("./app");

const fs = require('fs');

app.set("port", process.env.PORT || 3000);
const server = http.createServer(app);

// httpRequest()
server.listen(
  process.env.PORT || 3000,
  console.log("Serveur listening in port : 3000")
);

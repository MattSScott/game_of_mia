var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var path = require("path");
var uuid = require("uuid-random");

const {
  uniqueNamesGenerator,
  adjectives,
  colors,
  animals,
} = require("unique-names-generator");

// Running our server on port 3080
var PORT = process.env.PORT || 3080;

var server = app.listen(PORT, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Listening at http://%s:%s", "localhost:", port);
});

app.use(bodyParser.json());

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});

var io = require("socket.io")(server);

var miaRoomData = [];
var connectedClients = {};

io.on("connection", (client) => {
  console.log(`New client connected`);

  client.on("init", (name) => {
    if (name) {
      console.log(`${name} connected`);
    } else {
      let userID = uuid();
      let username = uniqueNamesGenerator({
        dictionaries: [adjectives, animals],
      });
      var userData = { userID: userID, username: username };
      miaRoomData.push(userData);
      console.log(`${username} connected`);

      client.emit("SetUserData", userData);
    }
  });

  client.on("roller", (msg) => {
    console.log(`${msg.name} rolled ${msg.score}`);
    client.emit("endTurn");
  });
});

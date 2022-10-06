var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var path = require("path");
var uuid = require("uuid-random");

const {
  uniqueNamesGenerator,
  adjectives,
  animals,
} = require("unique-names-generator");

// Running our server on port 3080
var PORT = process.env.PORT || 3080;

var server = app.listen(PORT, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log("Listening at http://%s:%s", "localhost", port);
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

var rooms = {};
var capacity = 4; // hard code for now but maybe change, idk

class roomStruct {
  constructor() {
    this.full = false;
    this.members = [];
    this.activePlayerIndex = 0;
  }

  addMember(client) {
    try {
      if (this.full) throw "Room is Full";
      this.members.push(client);
      if (this.members.length == capacity) {
        this.full = true;
      }
    } catch (err) {
      console.log(err); // be smarter with this
    }
  }

  nextTurn() {
    this.activePlayerIndex = (this.activePlayerIndex + 1) % this.members.length;
  }

  get activePlayer() {
    return this.members[this.activePlayerIndex].client;
  }

  get numMembers() {
    return this.members.length;
  }

  get roomMembers() {
    return Array.from(this.members, (x) => x.name);
  }
}

function checkPlayerState(name) {
  for (const [roomName, roomStruct] of Object.entries(rooms)) {
    let mems = roomStruct.roomMembers;
    if (name in mems) {
      return true;
    }
  }
  return false;
}

io.on("connection", (client) => {
  console.log(`New client connected`);

  client.once("init", () => {
    let userID = uuid();
    let username = uniqueNamesGenerator({
      dictionaries: [adjectives, animals],
    });
    var userData = { userID: userID, username: username };
    console.log(`${username} connected`);

    client.emit("SetUserData", userData);
  });

  client.once("initExisting", (name) => {
    console.log(`${name} connected`);
  });

  client.on("joinRoom", (room, didJoin) => {
    try {
      // let roomAttempt = rooms[room.roomName];

      if (rooms[room.roomName] && rooms[room.roomName].numMembers >= capacity) {
        didJoin(false);
        throw "Room is Full!";
      }

      didJoin(true);
      client.join(room.roomName);

      if (!rooms[room.roomName]) {
        rooms[room.roomName] = new roomStruct();
      }
      rooms[room.roomName].addMember({ client: client, name: room.userName });

      let isHost = rooms[room.roomName].numMembers == 1;
      client.emit("roomJoined", { host: isHost, room: room.roomName });

      console.log(rooms[room.roomName]);
      var roomies = rooms[room.roomName].roomMembers;

      console.log(roomies);

      io.to(room.roomName).emit("updateRoomies", roomies);
    } catch (err) {
      console.log(err);
    }
  });

  client.on("startGame", (room) => {
    let curr = rooms[room].activePlayer;
    curr.emit("startTurn");
    io.to(room).emit("gameStarted");
  });

  client.on("roller", (msg) => {
    console.log(`${msg.name} rolled ${msg.score}`);

    let room = rooms[msg.room];
    io.to(msg.room).emit("newScore", msg.score);

    let currPlayer = room.activePlayer;
    currPlayer.emit("endTurn");
    room.nextTurn();

    let nextPlayer = room.activePlayer;
    nextPlayer.emit("startTurn");
  });

  //   client.on("UserEnteredRoom", (data) => {
  //     connectedClients.ap
  //     // connectedClients[client.id] = data;
  //     // console.log(connectedClients);
  //     // console.log(Object.keys(connectedClients));
  //   });
});

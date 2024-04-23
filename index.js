var express = require("express");
var socket = require("socket.io");

var application = express();
var server = application.listen(3000, function () {
  console.log("Server Is Running at http:/localhost:3000");
});

application.use(express.static("public_html"));

var sio = socket(server);

sio.on("connection", function (visitor) {
  console.log("we have a new visitor with id => ", visitor.id);

  visitor.on("message", function (data) {
    sio.sockets.emit("new_msg", data);
  });

  visitor.on("broad_cast", function (data) {
    visitor.broadcast.emit("new_broad_cast", data);
  });
});

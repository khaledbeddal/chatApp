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

  visitor.on("usernameChange", (newUsername) => {
    sio.emit("updateUsername", newUsername);
  });

  visitor.on("message", function (data) {
    // Check if recipient is specified and is a valid socket ID
    if (data.recipient && sio.sockets.sockets[data.recipient]) {
      // Send the message only to the specified recipient
      sio.sockets.sockets[data.recipient].emit("new_msg", data);
    } else {
      // If no valid recipient is specified, send the message to all connected clients
      sio.sockets.emit("new_msg", data);
    }
  });

  visitor.on("broad_cast", function (data) {
    visitor.broadcast.emit("new_broad_cast", data);
  });

  visitor.on("message_deleted", function (data) {
    sio.sockets.emit("message_deleted", data);
  });

  sio.on("disconnect", () => {
    console.log("User disconnected");
  });
});

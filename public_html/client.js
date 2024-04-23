var socket = io.connect("http://localhost:3000");

var send = document.getElementById("send");
var chat = document.getElementById("chat");
var broadcast = document.getElementById("broadcast");
var recipient = document.getElementById("recipient");

send.addEventListener("click", function () {
  var selectedRecipient = recipient.value;
  var message = document.getElementById("message");
  var username = document.getElementById("username");

  if (message.value !== "" && username.value !== "") {
    var timestamp = new Date();
    var time = timestamp.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

    socket.emit("message", {
      username: username.value,
      message: message.value,
      recipient: selectedRecipient,
      timestamp: time,
    });
  } else {
    alert("Empty data!");
  }
});

message.addEventListener("keypress", function () {
  socket.emit("broad_cast", {
    username: username.value,
  });
});

socket.on("new_msg", function (data) {
  broadcast.innerHTML = "";

  var currentUserID = document.getElementById("username").value;

  if (data.username === username.value) {
    message.value = "";
    chat.innerHTML += `
        <div class="container own-message">
          <img src="profile_pic.png" class="right" alt="Avatar" class="right" style="width: 100%" />
          <div class="info">
          <strong class="username-text-right">${data.username}</strong>
          <p >${data.message}</p>
          <span class="time-left">${data.timestamp}</span>
          </div>
        </div>
      `;
  } else if (data.recipient === currentUserID || data.recipient === "general") {
    chat.innerHTML += `
        <div class="container other-message">
          <img src="profile_pic.png" alt="Avatar"  style="width: 100%" />
          <div class="info">
          <strong class="username-text-left">${data.username}</strong>
          <p >${data.message}</p>
          <span class="time-right">${data.timestamp}</span>
          </div>
        </div>
      `;
  }

  chat.scrollTop = chat.scrollHeight;
});

socket.on("new_broad_cast", function (data) {
  broadcast.innerHTML = `
    <strong>${data.username} : </strong>
      write message
      <img src="write.gif" style="width: 25px; height: 20px" />
    `;
});

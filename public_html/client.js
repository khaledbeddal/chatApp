var socket = io.connect("http://localhost:3000");

var username = document.getElementById("username");
var message = document.getElementById("message");
var send = document.getElementById("send");
var chat = document.getElementById("chat");
var broadcast = document.getElementById("broadcast");

send.addEventListener("click", function () {
  socket.emit("message", {
    username: username.value,
    message: message.value,
  });
});

message.addEventListener("keypress", function () {
  socket.emit("broad_cast", {
    username: username.value,
  });
});

socket.on("new_msg", function (data) {
  broadcast.innerHTML = "";

  if (data.username === username.value) {
    message.value = "";
    chat.innerHTML += `
        <div class="container own-message">
          <img src="profile_pic.png" class="right" alt="Avatar" class="right" style="width: 100%" />
          <div class="info">
          <strong class="username-text-right">${data.username}</strong>
          <p >${data.message}</p>
          <span class="time-left">11:01</span>
          </div>
        </div>
      `;
  } else {
    chat.innerHTML += `
        <div class="container other-message">
          <img src="profile_pic.png" alt="Avatar"  style="width: 100%" />
          <div class="info">
          <strong class="username-text-left">${data.username}</strong>
          <p >${data.message}</p>
          <span class="time-right">11:01</span>
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

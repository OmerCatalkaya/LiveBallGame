const socketio = require("socket.io");
const io = socketio();
const socketApi = {};

socketApi.io = io;

const users = {};

//helpers

const randomColor = require("../helpers/randomColor");

io.on("connection", socket => {
  console.log("a user connected...");

  socket.on("newUser", data => {
    const defaultData = {
      id: socket.id,
      position: { x: 0, y: 0 },
      color: randomColor()
    };

    const userData = Object.assign(data, defaultData);
    users[socket.id] = userData;

    socket.broadcast.emit("newUser", users[socket.id]);

    socket.emit("initPlayers", users);

    //console.log(users);
  });

  socket.on("disconnect", () => {
    socket.broadcast.emit("disUser", users[socket.id]);
    delete users[socket.id];
    console.log(users);
  });

  socket.on("animate", data => {
    if (users[socket.id]) {
      users[socket.id].position.x = data.x;
      users[socket.id].position.y = data.y;

      socket.broadcast.emit("animate", {
        socketId: socket.id,
        x: data.x,
        y: data.y
      });
    }
  });

  socket.on("newMessage", data => {
    console.log(data);
    
    const messageData = Object.assign({ socketId: socket.id }, data);
    socket.broadcast.emit("newMessage", messageData);
  });
});

module.exports = socketApi;

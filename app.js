const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
const exphbs = require('express-handlebars');
const fileUpload = require("express-fileupload");
const mysql = require("mysql8");
const bodyParser = require('body-parser');
var session = require('express-session');
var MySQLStore = require('express-mysql-session')(session);
const fs = require('fs');
const conn = require("./db/db.js");
const cookieParser = require("cookie-parser");

const app = express();

const TWO_HOURS = 1000 * 60 * 60 * 24;

const {
    PORT = 3201,
    NODE_ENV = 'development',

    SESS_NAME = 'sid',
    SESS_SECRET= 'ssh!quiet,it\'asecret!',
    SESS_LIFETIME = TWO_HOURS
} = process.env;

const IN_PROD = NODE_ENV === 'production';

// dotenv.config({ path: "./.env" });
dotenv.config({ path: path.join(__dirname, "./.env") });

app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(session({
    name: SESS_NAME,
    resave: false,
    saveUninitialized: false,
    secret: SESS_SECRET,
    cookie: {
        maxAge: SESS_LIFETIME,
        sameSite: true,
        secure: IN_PROD
    }
}));

//default option
app.use(fileUpload());
app.use(cookieParser());

// Static Files
const publicDirectory = path.join(__dirname, "./public");
app.use(express.static(publicDirectory));
app.use(express.static('upload'));

// Parse URL-encoded bodies (as sent by HTML forms)
app.use(express.urlencoded({ extended: false }));
// Parse JSON bodies (as sent by API clients)
app.use(express.json());

// Templating engine
app.set("view engine","hbs");
app.engine('hbs',exphbs({
    extname: 'hbs',
    defaultLayout: 'index',
    layoutsDir: __dirname + '/views/layouts',
    partialsDir: __dirname + '/views/partials',
}));


//Define Routes
app.use("/auth", require("./routes/auth"));
app.use("/", require("./routes/pages"));


// app.listen(PORT, ()=> console.log(`Listening on Port ${PORT}`));





// server for socket.io


// const path = require('path');
const http = require('http');
// const express = require('express');
const socketio = require('socket.io');
const formatMessage = require('./utils/messages');
const {
  userJoin,
  getCurrentUser,
  userLeave,
  getRoomUsers
} = require('./utils/users');

// const app = express();
const server = http.createServer(app);
const io = socketio(server);

// Set static folder
// app.use(express.static(path.join(__dirname, 'public')));

// app.set("view engine", "hbs");
// app.get("/", (req, res) => {
//   return res.render("index");
// });

// app.get("/chat", (req, res) => {
//   return res.render("chat");
// });

const botName = 'CW ChatRoom';

// Run when client connects
io.on('connection', socket => {
  socket.on('joinRoom', ({ username, room }) => {
    const user = userJoin(socket.id, username, room);

    socket.join(user.room);

    // Welcome current user
    socket.emit('message', formatMessage(botName, 'Welcome to CampusWeekly ChatRooms!'));

    // Broadcast when a user connects
    socket.broadcast
      .to(user.room)
      .emit(
        'message',
        formatMessage(botName, `${user.username} has joined the chat`)
      );

    // Send users and room info
    io.to(user.room).emit('roomUsers', {
      room: user.room,
      users: getRoomUsers(user.room)
    });
  });

  // Listen for chatMessage
  socket.on('chatMessage', msg => {
    const user = getCurrentUser(socket.id);

    io.to(user.room).emit('message', formatMessage(user.username, msg));
  });

  // Runs when client disconnects
  socket.on('disconnect', () => {
    const user = userLeave(socket.id);

    if (user) {
      io.to(user.room).emit(
        'message',
        formatMessage(botName, `${user.username} has left the chat`)
      );

      // Send users and room info
      io.to(user.room).emit('roomUsers', {
        room: user.room,
        users: getRoomUsers(user.room)
      });
    }
  });
});

// const PORT = process.env.PORT || 3030;

server.listen(PORT, () => console.log(`Server running on port ${PORT}`));


















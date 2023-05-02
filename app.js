var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
const cors = require("cors");
const session = require("express-session");
const { v4: uuidv4 } = require("uuid");
require("dotenv").config();
const mongoose = require("mongoose");
const socket = require("socket.io");

const userRouter = require("./routes/User/user");
const adminRouter = require("./routes/Admin/admin");


const app = express();

const uri = process.env.ATLAS_URI;



//database_connection
mongoose.connect(uri).then((data) => {
  console.log("CONNECTED");
});

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

//cacheControl
app.use(function (req, res, next) {
  if (!req.user) {
    res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
    res.header("Expires", "-1");
    res.header("Pragma", "no-cache");
  }
  next();
});

//session
app.use(
  session({
    secret: uuidv4(),
    resave: false,
    saveUninitialized: true,
    cookie: { maxAge: 6000000000 },
  })
);

//cors
const corsOptions = {
  origin: "https://twowheeler.onrender.com",
  credentials: true,
  optioSuccessStatus: 200,
};
app.use(cors(corsOptions));

app.use("/api/user", userRouter);
app.use("/api/admin", adminRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

const PORT = process.env.PORT || 2000;

const server = app.listen(PORT, (req, res) => {
  console.log(`server is runnig http://localhost:${PORT}/`);
});

const io = socket(server, {
  cors: {
    origin: "https://twowheeler.onrender.com",
    credentials: true,
  },
});

global.onlineUsers = new Map();

io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-receive", data.message);
      socket.emit("msg-sent", data.message); // emit message back to sender's socket
    }
  });
});

module.exports = app;

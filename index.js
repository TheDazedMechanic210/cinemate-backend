const express = require("express");
const cors = require("cors")
const http = require("http")
const mongoose = require('mongoose')
const bodyparser = require("body-parser")
const auth = require("./controllers/auth");
const content = require("./controllers/content")
const usercontent = require("./controllers/sendContent")
const matchmaker = require("./controllers/matchAlgo")
const chatController = require("./controllers/chatController")
const chat = require("./models/chats")
const jwt = require("jsonwebtoken")

const app = express();
const PORT = process.env.PORT || 8080;
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, {

  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  }

});

const corsOptions = {
  origin: "*",
  methods: ["GET", "POST"],

}

app.use(cors(corsOptions))

app.use(express.static(__dirname + '/public'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: true }));

app.get("/api/user-content", usercontent.sendData);

app.post("/api/signup", auth.signup);

app.post("/api/signin", auth.signin);

app.post("/api/user", content.addMovie);

app.get("/api/matchmaker", matchmaker.matchMaker);

app.get("/api/chat",chatController.fetchChat)

app.post("/api/chat",chatController.updateChat)

server.listen(PORT, (req, res) => {
  console.log(`Server is running on port ${PORT}.`);
});


io.on("connection", (socket) => {


  socket.on("join", username => {
    socket.username = username;
  })

  socket.on("sendMessage", (sender, reciever, message) => {
    {
      for (let [id, socket] of io.of("/").sockets) {

        if (socket.username == reciever) {
          io.to(id).emit("recieveMsg", sender, message)
        }

      }




    }
  })

});



const express = require("express");
const cors = require("cors")
const http = require("http")
const mongoose = require('mongoose')
const bodyparser = require("body-parser")
const auth = require("./controllers/auth");
const content = require("./controllers/content")
const usercontent = require("./controllers/sendContent")

const authJwt = require("./middlewares/verifyToken");

const app = express();
const PORT = process.env.PORT || 8080;


var corsOptions = {
    origin: "*",
    methods: ["GET", "POST"]
  };

app.use(cors(corsOptions));
app.use(express.static(__dirname + '/public'));
app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended:true}));

app.get("/api/user-content",usercontent.sendData);

app.post("/api/signup",auth.signup);

app.post("/api/signin",auth.signin);

app.post("/api/user",content.addMovie);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}.`);
});
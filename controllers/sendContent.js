const mongoose = require("mongoose");
const users = require("../models/users");
const movieList = require("../models/movieList")
const config = require("../config/config");
const jwt = require("jsonwebtoken")

const mongoUrl = "mongodb+srv://dazedmechanic210:mongoosetrial210@cluster0.67gtn.mongodb.net/cinemate?retryWrites=true&w=majority";

exports.sendData = (req,res) =>{
   var token = req.headers.authorization;
    var auth = token.split(" ")[1];
    var decoded = jwt.verify(auth,config.secret,(err,decoded)=>{
        const username = decoded.userid;
        movieList.findOne({username:username},(err,userList)=>{
            console.log(userList);
        })
    });
}
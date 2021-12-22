const mongoose = require("mongoose");
const movieList = require("../models/movieList")
const config = require("../config/config");
const jwt = require("jsonwebtoken")

const mongoUrl = "mongodb+srv://dazedmechanic210:mongoosetrial210@cluster0.67gtn.mongodb.net/cinemate?retryWrites=true&w=majority";


exports.addMovie = (req, res) => {
    mongoose.connect(mongoUrl, { useNewUrlParser: true }, err => {
        let result = {};
        let status = 201;
        var token = req.headers.authorization;
        var auth = token.split(" ")[1];
        
        const movie = req.body.movie;
        const rating = req.body.rating;


        var decoded = jwt.verify(auth,config.secret,(err,decoded)=>{


            const username = decoded.userid;

        movieList.findOne({ username: username }, (err, userList) => {
            if (userList) {
                
                const list = { movie: movie, rating: rating };
                movieList.update({ username: username }, { $push: { movieList: list } }, (err) => {
                });
                4
                result = list;
                res.status(status).send(result);

            }
            else {
                const list = [{ movie: movie, rating: rating }]
                const listObj = new movieList({ username: username, movieList: list });
                listObj.save((err, list) => {
                    if (!err) {
                        result.status = status;
                        result.result = list;
                    }
                    else {
                        result.status = 500;
                        result.error = err;
                    }
                    res.status(status).send(result);
                })

            }
        })

    });

    })
}


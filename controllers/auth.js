const mongoose = require("mongoose");
const users = require("../models/users");
const bcrypt = require("bcrypt")
const config = require("../config/config");
const jwt = require("jsonwebtoken")

const mongoUrl = "mongodb+srv://dazedmechanic210:mongoosetrial210@cluster0.67gtn.mongodb.net/cinemate?retryWrites=true&w=majority";
exports.signup = (req, res) => {

    mongoose.connect(mongoUrl, { useNewUrlParser: true }, (err) => {
        let result = {};
        let status = 201;
        if (!err) {
            const { username, password } = req.body;
            const user = new users({ username: username, password: password });

            user.save((err, user) => {
                if (!err) {
                    result.status = status;
                    result.result = user;
                } else {
                    status = 500;
                    result.status = status;
                    result.error = err;
                }
                res.status(status).send(result);
            });
        }
        else {
            status = 500;
            result.status = status;
            result.error = err;
            res.status(status).send(result);
        }
    })
}

exports.signin = (req, res) => {



    mongoose.connect(mongoUrl, { useNewUrlParser: true }, (err) => {
        let result = {};
        let status = 200;
        if (!err) {
            const username = req.body.username;
            const password = req.body.password;
            console.log(password);
            users.findOne({ username }, (err, user) => {
                if (!err && user) {
                    bcrypt.compare(password, user.password).then(match => {
                        if (match) {
                            status = 200;
                            const payload = { userid: user.username };
                            const options = { expiresIn: "2d" };
                            const secret = config.secret;
                            console.log(secret);
                            var token = jwt.sign( payload, secret, options );
                            result.status = status;
                            result.result = user;
                            result.token = token;
                        }
                        else {
                            status = 401;
                            result.status = status;
                            result.error = "Passwords didn't match";
                        }
                        res.status(status).send(result);
                    }).catch(err => {
                        console.log("here "+user.password);
                        status = 500;
                        result.status = status;
                        result.error = err;
                        const output = JSON.stringify(err);
                        console.log(err.message);
                        res.status(status).send(result);
                    });
                }
                else {
                    status = 404;
                    result.status = status;
                    result.error = err;
                    res.status(status).send(result);
                }
            })
        }
        else {
            status = 500;
            result.status = status;
            result.error = err;
            res.status(status).send(result);
        }
    })
}



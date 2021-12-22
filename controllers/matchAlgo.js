const mongoose = require("mongoose");
const movieList = require("../models/movieList")
const config = require("../config/config");
const jwt = require("jsonwebtoken")

const mongoUrl = "mongodb+srv://dazedmechanic210:mongoosetrial210@cluster0.67gtn.mongodb.net/cinemate?retryWrites=true&w=majority";

exports.matchMaker =  (req,res) => {

    mongoose.connect(mongoUrl,{useNewUrlParser:true},(err)=>{

        var token = req.headers.authorization;
        var auth = token.split(" ")[1];
        let matchArray=[];
        var decoded = jwt.verify(auth,config.secret,(err,decoded)=>{

            const username = decoded.userid;

            movieList.findOne({username:username},async(err,userList)=>{
                    
                const userMovieList = userList.movieList;

               for await (const doc of movieList.find()){

                if(doc.username==username){
                    continue;
                }

                let matchProfile = {}
                const otherList = doc.movieList;
               let matchRating = await compatibilityCalc(userMovieList,otherList)

                matchProfile.percentage = matchRating
                matchProfile.user = doc.username
                matchArray.push(matchProfile);
                
               }
               res.send(matchArray);

            })


        })
            
        
    });

    async function compatibilityCalc(userList, otherList)
    {
        let userCount = 0;
        let matchCount = 0;
        let ratingMatch = 0;
        userList.forEach(element => {
            userCount +=1;
            otherList.forEach(otherElement => {
                if(element.movie==otherElement.movie){

                    if(element.rating > 2 && otherElement.rating > 2){

                        matchCount +=1;
                        let perdiff;
                        let diffRating = Math.abs(element.rating - otherElement.rating);
                        switch (diffRating){
                            case 2:
                                perdiff = 25;
                                break;
                            case 1:
                                perdiff = 75;
                                break;
                            case 0:
                                perdiff = 100;
                                break;
                        }
                        ratingMatch += perdiff;
                        console.log(ratingMatch);

                    }
                }
            })
        });
        if(ratingMatch==0){
            ratingMatch = 0;
            console.log("yes")
        }
        else{
            ratingMatch = (ratingMatch/matchCount)*((matchCount)/userCount);

        }
        return ratingMatch;
        
    }}

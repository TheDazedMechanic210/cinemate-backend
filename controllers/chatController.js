const chat = require("../models/chats")
const jwt = require("jsonwebtoken")
const mongoose = require('mongoose')
const mongoUrl = "mongodb+srv://dazedmechanic210:mongoosetrial210@cluster0.67gtn.mongodb.net/cinemate?retryWrites=true&w=majority";
const config = require("../config/config");


exports.updateChat = (req, res) => {
    mongoose.connect(mongoUrl, { useNewUrlParser: true }, err => {
        let result = {}
        var token = req.headers.authorization;
        var auth = token.split(" ")[1];
        const { sender, reciever, message } = req.body
        const time = new Date();
        console.log(time +":-:"+message)

        var decoded = jwt.verify(auth, config.secret, (err, decoded) => {

            const username = decoded.userid;
            chat.findOne({ username: username }, (err, chatList) => {
                const time = new Date();
                console.log(time +"::"+message)

                if (!chatList) {

                    const messageItem = { sender: sender, reciever: reciever, message: message }
                    let messages = []
                    messages.push(messageItem)
                    let chatItem = {}
                    chatItem.participant = reciever
                    chatItem.messages = messages
                    let chatArray = []
                    chatArray.push(chatItem)
                    const chatListObj = new chat({ username: username, chats: chatArray })

                    chatListObj.save((err, list) => {

                        if (!err) {
                            result.result = list;
                        }
                        else {
                            result.error = err;
                        }

                    })

                    res.send(result)

                }
                else {
                    console.log(time +":-"+message)

                    let chatsObj = chatList.toObject().chats;
                    const chatExists = chatsObj.some(elem => {
                        if (elem.participant == reciever) {
                            return true
                        }
                    })
                    if (!chatExists) {
                        const messageItem = { sender: sender, reciever: reciever, message: message }
                        let messages = []
                        messages.push(messageItem)
                        let chatItem = {}
                        chatItem.participant = reciever
                        chatItem.messages = messages
                        chat.update({ username: username }, { $push: { chats: chatItem } }, (err => {
                            console.log(err)
                            result.resData = messageItem
                            res.send(result);

                        }))
                    }

                    else {
                        const messageItem = { sender: sender, reciever: reciever, message: message }
                        chat.update({ username: username }, { $push: { "chats.$[elem].messages": messageItem } }, { arrayFilters: [{ "elem.participant": reciever }] }, (error => {
                                const time = new Date();
                                console.log(time +":"+message)
                                result.resData = messageItem
                                res.send(result);

                        }))
                        const time = new Date();
                       
                    }
                }

            })

        })

        chat.findOne({ username: reciever }, (err, chatList) => {

            if (!chatList) {

                const messageItem = { sender: sender, reciever: reciever, message: message }
                let messages = []
                messages.push(messageItem)
                let chatItem = {}
                chatItem.participant = sender
                chatItem.messages = messages
                let chatArray = []
                chatArray.push(chatItem)
                const chatListObj = new chat({ username: reciever, chats: chatArray })

                chatListObj.save((err, list) => {

                    if (!err) {
                        result.result = list;
                    }
                    else {
                        result.error = err;
                    }

                })

                res.send(result)

            }
            else {
                let chatsObj = chatList.toObject().chats;
                const chatExists = chatsObj.some(elem => {
                    if (elem.participant == sender) {
                        return true
                    }
                })
                if (!chatExists) {
                    const messageItem = { sender: sender, reciever: reciever, message: message }
                    let messages = []
                    messages.push(messageItem)
                    let chatItem = {}
                    chatItem.participant = sender
                    chatItem.messages = messages
                    chat.update({ username: reciever }, { $push: { chats: chatItem } }, (err => {
                        console.log(err)
                    }))
                }

                else {
                    const messageItem = { sender: sender, reciever: reciever, message: message }
                    chat.update({ username: reciever }, { $push: { "chats.$[elem].messages": messageItem } }, { arrayFilters: [{ "elem.participant": sender }] }, (error => {

                    }))
                }
            }
        })


    })

}

exports.fetchChat = (req, res) => {

    mongoose.connect(mongoUrl,{useNewUrlParser:true},(err)=>{

    var token = req.headers.authorization;
    var auth = token.split(" ")[1];

    var decoded = jwt.verify(auth, config.secret, (err, decoded) => {
            const username = decoded.userid 
        chat.findOne({username:username},(err,chatList)=>{

            res.send(chatList)
        })
    })
})
}
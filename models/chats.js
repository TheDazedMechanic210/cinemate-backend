const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const chatSchema = new Schema({

    username: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },

    chats: [
        {
            participant: String,
            messages: [{
                sender: String,
                reciever: String,
                message: String
            }]
        }
    ]
})


module.exports = mongoose.model("chats",chatSchema);
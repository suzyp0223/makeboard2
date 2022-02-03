const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
    postId: {
        type: Number,
        required: true,
        unique: true
    },
    title: {
        type: String,
        required: true
    },
    content: {
        type: String,
        required: true
    },
    writer: {
        type: String,
        required: true
    },
    date: {
        type: String,
        required: true
    },
    password: {
        type: String
    }
});

module.exports = mongoose.model("Post", postSchema);
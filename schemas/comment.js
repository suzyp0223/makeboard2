const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    commentId: {
        type: Number,
        required: true,
        // unique: true   이거때문에 코멘트 쓸때 처음 코멘트 페이지 이후에 다른 페이지에서 생성이 안됨.

    },
    postId: {
        type: Number,
        required: true,
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
    }
});

module.exports = mongoose.model("Comment", commentSchema);
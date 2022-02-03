const express = require("express");
const router = express.Router(); //라우터 선언
const Comment = require("../schemas/comment");
const authMiddleware = require("../middlewares/auth-middleware");
const comment = require("../schemas/comment");

//해당 포스트 전체 댓글 조회
router.get("/Allcomment/:postId", authMiddleware, async (req, res) => {
    try {
        const { postId } = req.params;
        let comments = await Comment.find({ postId }).sort("-date").lean();
        for (let i = 0; i < comments.length; i++) {
            if (res.locals.user != null && comments[i]['writer'] == res.locals['user']['nickname']) {
                comments[i]['mine'] = true
                console.log("라우터 댓글 전체 조회 mine1 > " + comments[i].mine);

            } else comments[i]['mine'] = false
            console.log("라우터 댓글전체조회 mine2 > " + comments[i].mine);
        }
        res.json({ comments: comments });
    } catch (err) {
        console.error(err);
        next(err);
    }
});

//댓글 한개 조회
router.get("/comment/:commentId", async (req, res) => {
    const { commentId } = req.params;
    comment = await Comment.findOne({ commentId });
    res.json({ detail: commnet });
});

//댓글 작성
router.post('/comment', authMiddleware, async (req, res) => { 
    const recentComment = await Comment.find().sort("-commenId").limit(1);
    let commentId = 1;
    if(recentComment.length != 0) {
        commentId = recentComment[0]['commentId'] +1
    }
    const writer = res.locals['user']['nickname']
    const { postId, content } = req.body;
    console.log("라우터댓글작성postId > " + postId);
    console.log("라우터댓글작성content > " + content);

    //2022-02-03 09:40:10 형식으로 출력
    const date = new Date(+new Date() + 3240 * 10000).toISOString().replace("T", " ").replace(/\..*/, '');
    //아래에 format을 따로 만들어둠
    // const date=(new Date().format("yyyy-MM-dd a/p hh:mm:ss"))

    await Comment.create({ commentId, postId, content, writer, date});
    // res.redirect(req.get('referer'));
    console.log("라우터댓글작성postId > " + postId);
    console.log("라우터댓글작성 값들 > " + commentId, postId, content, writer, date);
    res.send({ result: "success" });
        
});


//댓글 수정
router.patch("/comment/", async(req, res) => {
    const { content, commentId } = req.body;
    await Comment.updateOne({ commentId }, { $set: { content } });
    res.send({ result: 'success' });
    console.log("라우터commentjs 댓글수정 성공!!" );
});


//댓글 삭제
router.delete("/comment/:commentId", async (req, res) => {
    const { commentId } = req.params;
    await Comment.deleteOne({ commentId });
    res.send({ result: "success" });
});


module.exports = router;
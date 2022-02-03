const express = require("express");
const router = express.Router();   //라우터 선언
const Post = require("../schemas/post");
const authMiddleware = require("../middlewares/auth-middleware");
const post = require("../schemas/post");

//Post 전체 목록 조회 
router.get("/post", async (req, res) => {
    try {
        const post = await Post.find({}).sort("-date");
        res.json({
            post,  // 객체 초기자
        });
    } catch (error) {
        res.status(400).send ({ error: error.message });
        console.log("라우터post 전체목록조회 post값: " + post);
    }
});


//Post 상세  조회
router.get("/post/:postId", authMiddleware, async (req, res) => {
    console.log("get")
    const { postId } = req.params;
    let mine = false;
    const post = await Post.findOne({ postId });
    console.log("라우터 포스트상세조회 postId > " + postId); 
    if (res.locals.user != null && post['writer'] == res.locals['user']['nickname']) {
        mine = true
        console.log("라우터포스트상세조회 post에 들어있는 값은? " + post);
    }
    //detail키는 static>js>deatil.js의 게시글 상세 조회에서 쓰임
    res.json({ detail: post, mine: mine }); 
});


//Post 작성
router.post("/post", authMiddleware, async (req, res) => {
    //sort(-postId)postId내림차순,limit(1)-데이터 1개만 출력
    const recentPost = await Post.find().sort("-postId").limit(1);
    let postId = 1;
    if (recentPost.length != 0) {
        postId = recentPost[0]['postId'] + 1 
    }
    console.log("라우터 post-recentPost는? : " + recentPost);
    const { title, content, password} = req.body;
    const writer = res.locals['user']['nickname']
    console.log("writer는?" +  writer);
    //db의 date 호출전 날짜 형식 맞추기   //2022-02-03 09:40:10 형식으로 출력
    const date = new Date(+new Date() + 3240 * 10000).toISOString().replace("T", " ").replace(/\..*/, '');
    console.log("라우터post작성 date는? " + date);

    try {
        await Post.create({ postId, title, content, writer, date, password });
    } catch (err) {
        console.log("에러: " + err);
        console.log("라우터post작성 postDB 값들 " + postId, title, content, writer, date, password);
    }
    res.send({ result: "success" });
});


//Post 수정
router.patch("/post/:postId", async (req, res) => {
    const { postId } = req.params;
    const { title, content, writer, date, password } = req.body;
    isExist = await Post.find({ postId });
    if (isExist[0]['password'] == password) {
        await Post.updateOne({ postId }, { $set: { postId, title, content, writer, date, password } });
        res.send({ result: "success" });
    } else {
        res.send({ result: "faild" });
    }
});


//Post 삭제
router.delete("/post/:postId", async (req, res) => {
    const { postId } = req.params;
    const { password } = req.body;
    isExist = await Post.find({ postId });
    if (isExist[0]['password'] == password) {
        await Post.deleteOne({ postId });
        res.send({ result: "success" });
    } else {
        res.send({ result: "faild" });
    }
});



module.exports = router;
const express = require('express');
const app = express();
const port = 3000;
const Joi = require('joi');  //유효성검사 joi라이브러리사용
const jwt = require("jsonwebtoken");
//사용자 인증 미들웨어
const authMiddleware = require("./middlewares/auth-middleware");
// const token = jwt.sign({ test:  });
//스키마 연결
const connect = require("./schemas"); 
//db 연결
connect(); 

//Request 로그 남기는 미들웨어
const requestMiddleware = (req, res, next) => {
  console.log("Request URL:", req.originalUrl, " - ", new Date());
  next();
};

//바디로 들어온 제이슨 형태를 파싱
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(requestMiddleware);


//router 가져오기
const postRouter = require("./routes/post"); 
const commentRouter = require("./routes/comment"); 
const userRouter = require("./routes/user"); 
//Router 미들웨어 사용
app.use("/api", [postRouter]); 
app.use("/api", [commentRouter]); 
app.use("/", [userRouter]);    // "/"라는 경로로 들어왔을때 userRouter실행


//정적파일 사용
app.use(express.static("static"));
//프론트 연결 ejs view engine
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');

//root 페이지 렌더링. URL에서 '/' Path로 요청이 오면 index.ejs연결
app.get('/', (req, res) => {
  res.render('index');
});
//게시글 쓰기
app.get('/post', (req, res) => {
  res.render('post');
});
//게시글 보기 + comment 쓰기보기수정삭제 
app.get('/detail', (req, res) => {   //파라미터로 가져오는 postId(쿼리스트링)를 id로 변경해서 가져온다
  let id = req.query.postId;         // localhost:3000/detail?id=1
  res.render('detail', {id});
});
//회원가입
app.get('/join', (req, res) => {  
  res.render('join');
});
//로그인
app.get('/login', (req, res) =>{
  res.render('login');
});

app.listen(port, () => {
  console.log(port, ': 포트로 서버가 열렸어요!');
});
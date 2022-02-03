const express = require("express");
const router = express.Router();//라우터라고 선언한다.
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const User = require("../schemas/user");
const authMiddleware = require("../middlewares/auth-middleware");

const postUsersSchema = Joi.object({
    email: Joi.string().email().required(),
    nickname: Joi.string().alphanum().min(3).required(),
    password: Joi.string().min(4).required(),
    confirmPassword: Joi.string().required(),
});
router.get("/is-login", async (req, res) => {

});

//회원가입
router.post("/users", async (req, res) => {
    try {
        const { nickname, email, password, confirmPassword
        } = await postUsersSchema.validateAsync(req.body);

        //로그인시 웹페이지에서 alert 출력
        //패스워드와 패스워드 확인란이 동일한지 비교
        if (password !== confirmPassword) {
            res.status(400).send({
                errorMessage: '패스워드가 패스워드 확인란과 동일하지 않습니다.',
            });
            return;
        }
        //패스워드에 닉네임 포함됐는지 확인
        if (password.indexOf(nickname) > -1) {  //배열에 요소가 있는지 확인
            res.status(400).send({
                errorMessage: '패스워드에 닉네임을 포함시킬 수 없습니다.',
            });
            return;
        }
        //이메일 DB에 겹치는지 확인
        const existEmail = await User.find({ email });
        if (existEmail.length) {
            res.status(400).send({
                errorMessage: '이미 가입된 이메일이 있습니다.',
            });
            return;
        }
        //닉네임 DB에 겹치는지 확인
        const existNickname = await User.find({ nickname });
        if (existNickname.length) {
            res.status(400).send({
                errorMessage: '이미 가입된 닉네임이 있습니다.',
            });
            return;
        }

        //사용자 DB저장
        const user = new User({ email, nickname, password });
        await user.save();
        //응답값은 잘되면201 에러면400
        res.status(201).send({});
    } catch (error) {
        console.log(error);
        res.status(400).send({
            errorMessage: error['message'],
        });
    }
});

const postAuthSchema = Joi.object({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
});

//로그인. 로그인시 email, password 입력, body에도 같은걸 준다.
router.post("/auth", async (req, res) => {
    try {
        const { email, password } = await postAuthSchema.validateAsync(req.body);

        const user = await User.findOne({ email, password }).exec();

        if (!user) {
            res.status(400).send({
                errorMessage: "이메일 또는 패스워드가 잘못되었습니다.",
            });
            return;
        }

        //jwt.sign을 해야 jwt사용할수 있다.  userId란 키를 가진곳에 user.userId를 넣는다.
        const token = jwt.sign({ userId: user.userId }, "my-secret-key");
        console.log("user.js token:" + token)
        res.send({
            token,
        });
    } catch (err) {
        console.log(err);
        res.status(400).send({
            errorMessage: "요청한 데이터 형식이 올바르지 않습니다.",
        });
    }
});

//미들웨어 불러오기. /users/me 경로로 들어오는 경우에만 authMiddleware실행됨.
router.get("/users/me", authMiddleware, async (req, res) => {
    //user라는 변수에 res.locals라는 객체 안에 있는
    //user라는 키가 res.locals에서 구조 분해 할당이 되어 {user}에 값이 들어감.
    const { user } = res.locals;
    console.log("라우터 유저/users/me에 user값은? " + user);
    res.send({
        user,
        // user: {   //위 user,와 4줄이 동일함
        //     email: user.email,
        //     nickname: user.nickname,
        // },
    });
});

module.exports = router;
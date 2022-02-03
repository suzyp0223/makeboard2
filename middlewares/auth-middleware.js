//사용자 인증 미들웨어 
const jwt = require("jsonwebtoken")
const User = require("../schemas/user")

// 미들웨어는 항상 next호출해야 다음으로 넘어간다.
module.exports = (req, res, next) => {
  console.log("MIDDLE")
    // 프론트에서 대문자로 보내도 무조건 소문자로 들어옴
    const { authorization } = req.headers;
    // 공백을 기준으로 잘라 배열로 반환.
    const [tokenType, tokenValue] = authorization.split(' ');
        console.log('어스 미들웨어의 tokenValue 값은? ' + tokenValue);
        console.log('어스 미들웨어의 tokenType 값은? ' + tokenType);
    // 토큰타입이 배열어일때만 동작하면 된다.
    if (tokenValue == 'null') {
      res.locals.user = null
      next();
      return;
  }   //tokenType이 Bearer베얼어 가 아닐 경우 탈출
    if (tokenType !== 'Bearer') {
        res.status(401).send({ // 401은 인증실패 스테이터스 코드
            errorMessage: '로그인 후 사용하세요',
        });
        return;
    }
    //try 구문에서 에러발생시 catch(error)로 넘어감
    try {   //decoded에 userId가 있어서 바꿈. decoded가 제대로 값이 나오면 항상 유효한 토큰.
        const { userId } = jwt.verify(tokenValue, "my-secret-key");
        
        //db에서 실제로 userId있는지 찾음.
        User.findById(userId).exec().then((user) => {
            res.locals.user = user  // locals에 사용자 정보를 담는데 이 미들웨어 사용하는 모든 곳에서 사용 가능
            next();
        });

        // decoded가 유효하지 않으면 catch로 이동.
    } catch (error) {
        res.status(401).send({    // 401이 인증실패 스테이터스 코드
            errorMessage: '로그인 후 사용하세요'
        });
        return;
    }
};




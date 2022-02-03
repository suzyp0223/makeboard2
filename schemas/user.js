const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    email: String,
    nickname: String,
    password: String,
});

//단뱡향 암호화 virtual메소드 
//userId라는 가상 속성을 만들고 get일 경우 
//_id를 toHexString메서드로 형변환해 string으로 반환.
userSchema.virtual("userId").get(function () {
    return this._id.toHexString();   //mongodb에서 생성된 ' _id '는 string이 아니므로
});                                  //toHexString메서드를 통해 형변환한다.

userSchema.set("toJSON", {    //형변환한 값을 다시 toJSON에 넣는다.
    virtuals: true,
});


module.exports = mongoose.model("User", userSchema);
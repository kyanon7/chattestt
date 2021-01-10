const mongoose = require("mongoose"); // mongoose를 불러옴
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    maxlength: 50,
  },

  email: {
    type: String,
    trim: true, // 스페이스 제거
    unique: 1, // 중복방지
  },

  password: {
    type: String,
    minlength: 5,
  },

  lastname: {
    type: String,
    maxlength: 50,
  },

  role: {
    type: Number,
    default: 0,
  }, //어떤 유저가 관리자가 될 수도 있고 일반 유저가 될 수도 있다. 관리자는 또 그 일반 유저를 관리 할 수도 있고 그래서 사용 넘버가 1이면 뭐 관리자고 0이면 일반유저

  image: String,

  token: {
    type: String,
  }, //유효성 관리

  tokenExp: {
    type: Number,
  }, //토큰이 사용할 수 있는 기간을 주는 것
});

userSchema.pre("save", function(next) {

  var user = this;

  if(user.isModified("password")){
    bcrypt.genSalt(saltRounds, (err, salt) => {
      if(err) {
        return next(err);
      }

      bcrypt.hash(user.password, salt, (err, hash) => {
        if(err) {
          return next(err);
        }
        user.password = hash;
        next();

      });
    });

  }else{
    next();
  }
});

userSchema.methods.comparePassword = function(plainPassword, cb) {

  bcrypt.compare(plainPassword, this.password, function(err, isMatch) {
    if(err){
      return cb(err);
    }
    cb(null, isMatch);
  });
};

userSchema.methods.generateToken = function(cb) {
  var user = this;

  var token = jwt.sign(user._id.toHexString(), "secretToken");

  user.token = token;
  user.save(function(err, user) {
    if(err){
      return cb(err);
    }
    cb(null, user);
  });
};

// 그 다음 이 스키마를 모델로 감싸준다고 하였다.

const User = mongoose.model("User", userSchema);

//'User'에는 이 모델의 이름을 적어주고 그 오른쪽은 스키마 이름을 가져오면 된다.

//이 모델을 다른 파일에서도 쓰고 싶다면?

module.exports = { User };
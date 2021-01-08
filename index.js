const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const config = require("./config/key");
const {User} = require("./models/User");
const app = express();
const port = 3000;
const corsOptions = {
  origin: "*", // 허락하고자 하는 요청 주소
  credentials: true // true로 하면 설정한 내용을 response 헤더에 추가 해줍니다.
};

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors(corsOptions));

const mongoose = require("mongoose");
mongoose
  .connect(
    config.mongoURI,
    {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      useCreateIndex: true,
      useFindAndModify: false,
    }
  )
  .then(() => console.log("MongoDB Connected..."))
  .catch((err) => console.log(err));

app.get("/", (req, res) => res.send("Hello World!"));

app.post("/register", (req, res) => {
  const user = new User(req.body);

  user.save((err, userInfo) => {
    if(err) return res.json({success: false, err});
    return res.status(200).json({
      success: true
    });
  });
});

app.post("/login", (req, res) => {
  
  User.findOne({ email: req.body.email }, (err, user) => {
    if(!user){
      return res.json({
        loginSuccess: false,
        message: "제공된 이메일에 해당하는 유저가 없습니다."
      });
    }
  });

  user.comparePassword(req.body.password, (err, isMatch) => {
    if(!isMatch) 
      return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다."

      user.generateToken((err, user) => {
        if(err) return res.status(400).send(err);

        res.cookie("x_auth", user.token).status(200).json({loginSuccess: true, userId: user._id});
      })

      });
  });
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const {User} = require("./models/User");
const app = express();
const port = 3000;
const corsOptions = {
  origin: `http://127.0.0.1:${port}`, // 허락하고자 하는 요청 주소
  // optionsSuccessStatus: 200,
  // credentials: true // true로 하면 설정한 내용을 response 헤더에 추가 해줍니다.
};

app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
app.use(cors(corsOptions));

const mongoose = require("mongoose");
mongoose
  .connect(
    "mongodb+srv://chatAdmin:OkWKNubcjogkIXxZ@firstcluster.7b3h5.mongodb.net/users?retryWrites=true&w=majority",
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
    if(err) return res.json({success:false, err});
    return res.status(200).json({
      success: true
    });
  });
});

app.listen(port, () =>
  console.log(`Example app listening at http://localhost:${port}`)
);
// 서버 새로고침을 해주는 nodemon설치해보자

// 자동 새로고침이 안되는건 "start:dev": "nodemon -L index.js"로 명령어를 수정해서 고침!

import express from "express";

const app = express();

app.get("/qqq", function (req, res) {
  res.send("내용새로고쳐라야잇");
});

app.listen(3000);

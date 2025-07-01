// # ODM 중 하나인 mongoose를 몽고디비에 연결하고 사용해보자

import mongoose from "mongoose";
import express from "express";
import { checkPhone, getToken, sendTokenToSMS } from "./phone.js";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { options } from "./swagger/config.js";
import cors from "cors";
import { checkEmail, sendWelcomeToEmail, welcomeTemplate } from "./email.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(options)));
app.get("/boards", function (req, res) {
  const result = [
    { number: 1, writer: "철수", title: "제목입니다", contents: "내용입니다" },
    { number: 2, writer: "영희", title: "제목입니다", contents: "내용입니다" },
    { number: 3, writer: "훈이", title: "제목입니다", contents: "내용입니다" },
  ];

  res.send(result);
});

app.post("/boards", function (req, res) {
  console.log(req);
  console.log("==================");
  console.log(req.body);

  res.send("게시물 등록에 성공하였습니다. ");
});

app.post("/tokens/phone", function (req, res) {
  const isValid = checkPhone(req.body.qqq);
  if (isValid === false) return;

  const myToken = getToken();

  sendTokenToSMS(req.body.qqq, myToken);

  res.send("인증완료 후 cors까지 해결완");
});

app.post("/users", function (req, res) {
  const { name, age, school, email } = req.body;

  const isValid = checkEmail(email);
  if (isValid === false) return;

  const welcome = welcomeTemplate({ name, age, school });

  sendWelcomeToEmail(email, welcome);

  res.send("가입완료!");
});

// 몽고디비(데이터베이스 컴퓨터)와 몽구스(백엔드 서버 컴퓨터 -> 왜냐면 몽구스는 express를 통해서 요청하는거니까)를 연결하기
mongoose
  // localhost가 아니라 my-database로 연결 요청해야된다
  // .connect("mongodb://localhost:27017/mydocker")
  .connect("mongodb://my-database:27017/mydocker")
  .then(() => console.log("db접속 성공!"))
  .catch(() => console.log("db접속에 실패하였습니다"));
// mydocker처럼 디비에 없는 컬렉션을 요청하면 자동으로 만들어진다

// mongodb://localhost:27017/mydocker로 걍 접속하면 db접속에 실패하였습니다가 뜬다
// 왜냐면 DB '접속'을 못하는 상황이기 때문
// mongodb://localhost:27017/mydocker 이 코드는 express가 실행되고 있는 도커 컴퓨터(e컴퓨터)에서 localhost에 접속을 요청하는건데, e컴퓨터에는 27017로 실행중인 프로그램이 없음. mongodb가 실행되고 있는 도커 컴퓨터(m컴퓨터)에서만 27017로 프로그램이 실행중인거임. 백엔드 서버 컴퓨터 내부(e서버)에서 27017로 요청을 보내니까 데이터베이스 컴퓨터(m서버)로는 요청이 안 날아가는거임

// docker-compose로 도커를 열면 두 도커 사이에 연결이 생김. 거기로 연결을 보내줘야됨. 이때 연결은 도커 이름으로 연결한다
// 이 이름은 docker-compose.yaml파일에서 만들어준 이름으로 해야된다
// 즉 여기에서는 e컴퓨터 속 localhost:27017이 아니라 my-database:27017로 요청을 보내야 m컴퓨터로 요청이 날라가는거임
// 이걸 "네임 리졸루션"(name-resolution)이라고 부른다

app.listen(4000);

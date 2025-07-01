// 몽구스로 게시판 데이터를 저장하고 조회하는 API를 만들어보자

// 왼쪽에 express실행도커가 있고, 오른쪽에 mongoDB실행도커가 있다고 해보자
// API자체는 왼쪽에 만들고, 데이터 저장은 오른쪽에 하는거다
// 데이터는 컬렉션에 저장할거고 컬렉션의 구조를 작성해놓는걸 스키마 라고 부르며, 스키마들을 담아놓은 폴더는 models라고 부름

import mongoose from "mongoose";
import express from "express";
import { checkPhone, getToken, sendTokenToSMS } from "./phone.js";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { options } from "./swagger/config.js";
import cors from "cors";
import { checkEmail, sendWelcomeToEmail, welcomeTemplate } from "./email.js";
import { Board } from "./models/board.model.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(options)));
app.get("/boards", async function (req, res) {
  // 1. DB에 접속해서 데이터 가져오기
  // Board.find();가 SQL을 쉽게 도와주는 ODM명령어인거임!
  // 여기서 Board는 models에서 가져온 스키마 이다!
  const result = await Board.find();

  // 2. 가져온 데이터 결과를 브라우저에 응답 주기
  res.send(result);
});

app.post("/boards", async function (req, res) {
  // 1. 브라우저에서 보내준 데이터 확인
  console.log(req);
  console.log("==================");
  console.log(req.body);

  // 2. 몽구스를 통해서 DB에 데이터 저장
  const board = new Board({
    writer: req.body.writer,
    title: req.body.title,
    contents: req.body.contents,
  });

  // 위의 코드는 서버에서 실행하는거고, board.save()를 해줘야 디비에 저장된다

  await board.save();

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

mongoose
  .connect("mongodb://my-database:27017/mydocker")
  .then(() => console.log("db접속 성공!"))
  .catch(() => console.log("db접속에 실패하였습니다"));

app.listen(4000);

// 이렇게 소스코드를 수정한 뒤에는 docker-compose build를 해서 이미지를 새로 만들어준 다음에, docker-compose up으로 서버를 실행해주면 된다

// 몽고디비에 접속하려면 포트포워딩을 다시 켜줘야 된다. 몽구스 접속때문에 포트포워딩을 꺼놨었는데 지금은 컴패스를 통한 디비 접속이 필요하니까 yaml파일에서 다시 켜주자

// 컴패스에서 데이터 입력된거 반영하려면 우측상단에 새로고침 버튼 누르면 됨

// 포스트맨에서 POST 요청을 날리면 서버를 거쳐서 디비에 데이터가 입력되고, GET요청을 날리면 서버를 거쳐서 디비에 요청이 들어가고 그걸 꺼내서 다시 서버를 거쳐서 포스트맨에 응답이 온다

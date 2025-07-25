// 회원가입 완료 후 이메일로 가입환영 메시지를 전송해보자

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

// 회원 등록 후 가입 축하 메일 보내는  api
app.post("/users", function (req, res) {
  // const name = req.body.name;
  // const age = req.body.age;
  // const school = req.body.school;
  // const email = req.body.email;

  // 구조 분해 할당으로 가져오자
  const { name, age, school, email } = req.body;

  const isValid = checkEmail(email);
  if (isValid === false) return;

  const welcome = welcomeTemplate({ name, age, school });

  sendWelcomeToEmail(email, welcome);

  res.send("가입완료!");
});

app.listen(4000);

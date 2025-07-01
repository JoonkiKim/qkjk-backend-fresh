import express from "express";

import mongoose from "mongoose";
import swaggerUi from "swagger-ui-express";

import swaggerJsdoc from "swagger-jsdoc";
// import "dotenv/config";

import { options } from "./swagger/config.js";
import cors from "cors";
import { checkPhone, getToken, sendTokenToSMS } from "./phone.js";
import { checkEmail, sendWelcomeToEmail, welcomeTemplate } from "./email.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(options)));
app.get("/users", function (req, res) {
  const result = [
    {
      email: "aaa@gmail.com",
      name: "철수",
      phone: "010-1234-5678",
      personal: "220110-2222222",
      prefer: "https://naver.com",
    },
    {
      email: "aaa@gmail.com",
      name: "영희애",
      phone: "010-1234-5678",
      personal: "220110-2222222",
      prefer: "https://naver.com",
    },
    {
      email: "aaa@gmail.com",
      name: "훈이이",
      phone: "010-1234-5678",
      personal: "220110-2222222",
      prefer: "https://naver.com",
    },
    {
      email: "aaa@gmail.com",
      name: "핑이",
      phone: "010-1234-5678",
      personal: "220110-2222222",
      prefer: "https://naver.com",
    },
    {
      email: "aaa@gmail.com",
      name: "팡이이",
      phone: "010-1234-5678",
      personal: "220110-2222222",
      prefer: "https://naver.com",
    },
  ];

  res.send(result);
});

app.get("/starbucks", function (req, res) {
  const result = [
    {
      name: "아메리카노1",
      kcal: 5,
    },
    {
      name: "아메리카노2111",
      kcal: 5,
    },
    {
      name: "아메리카노3",
      kcal: 5,
    },
    {
      name: "아메리카노4",
      kcal: 5,
    },
    {
      name: "아메리카노5",
      kcal: 5,
    },
    {
      name: "아메리카노6",
      kcal: 5,
    },
    {
      name: "아메리카노7",
      kcal: 5,
    },
    {
      name: "아메리카노8",
      kcal: 5,
    },
    {
      name: "아메리카노9",
      kcal: 5,
    },
    {
      name: "아메리카노10",
      kcal: 5,
    },
  ];

  res.send(result);
});

app.post("/tokens/phone", function (req, res) {
  const isValid = checkPhone(req.body.phonenumber);
  if (isValid === false) return;

  const myToken = getToken();

  sendTokenToSMS(req.body.phonenumber, myToken);

  res.send("인증완료 후 cors까지 해결완");
});

// 회원 등록 후 가입 축하 메일 보내는  api
app.post("/usersemail", function (req, res) {
  // 프런트에서 넘겨준 데이터는 무조건 req에 있는거다!!!
  const { name, phonenumber, preference, email } = req.body;

  const isValid = checkEmail(email);
  if (isValid === false) return;

  const welcome = welcomeTemplate({ name, phonenumber, preference });

  sendWelcomeToEmail(email, welcome);

  res.send("가입완료!");
});

mongoose
  .connect("mongodb://my-database:27017/mydocker")
  .then(() => console.log("qz8 db접속 성공!"))
  .catch(() => console.log("qz8 db접속에 실패하였습니다"));

app.listen(3000);

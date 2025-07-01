// axios로 post요청을 날려보자. 참고로 axios는 REST API에서 사용하는거다! <> apollo-client는 graphQL!

import express from "express";
import { checkPhone, getToken, sendTokenToSMS } from "./phone.js";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import { options } from "./swagger/config.js";
import cors from "cors";

const app = express();
app.use(express.json());
app.use(cors());
// cors허용은 기본적으로 안되어있는거고, 허용해주고 싶으면 위의 코드처럼 써주면 된다
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

app.listen(3000);

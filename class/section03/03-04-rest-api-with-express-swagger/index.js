// swagger를 이용해서 API DOCS를 만들어보자
// api docs도 vscode에서 만드는거다!
// 백엔드 개발자는 api만 만드는게 아니라 독스까지 만들어야 한다

import express from "express";
import { checkPhone, getToken, sendTokenToSMS } from "./phone.js";

import swaggerUi from "swagger-ui-express";

import swaggerJsdoc from "swagger-jsdoc";

import { options } from "./swagger/config.js";

// 옵션 부분은 config.js에 넣어준다다
// const options = {
//   definition: {
//     openapi: "3.0.0",
//     info: {
//       title: "나의 API 설명서",
//       // title은 api doc페이지의 제목
//       version: "1.0.0",
//     },
//   },
//   apis: ["./swagger/*.swagger.js"], // swagger폴더 안에 ~.swagger.js라고 생긴 모든 파일을 api독스로 인식한다는 뜻
// };

const app = express();
app.use(express.json());
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerJsdoc(options)));
// app.use로 엔드포인트로 접속을 해서 use를 실행시키는거다. 미들웨어함수가 두개인 이유는 app.~ 에 함수가 여러개 들어갈 수 있고 순서대로 실행되는 거다. 예를 들어 swaggerUi.serve안에 그 다음으로 넘기는 명령어가 있을거고 그러면 swaggerUi.setup(swaggerJsdoc(options))이 그 다음으로 실행된다
// http://localhost:3000/api-docs
// 여기로 접속하면 boards.swagger.js에서 만든 독스 페이지를 볼 수 있다

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

  res.send("인증완료오 후 변경!!!!");
});

app.listen(3000);

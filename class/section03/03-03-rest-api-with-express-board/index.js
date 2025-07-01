// REST API만들어보기

import express from "express";
import { checkPhone, getToken, sendTokenToSMS } from "./phone.js"; /// export하기 위해 가져옴
// 중괄호가 없는건 export default를 가져온것(그 파일에서 기본적으로 가져오는 것), 있는건 export를 가져온것
// 그래서 export default는 다른 이름으로 가져와도 되긴한다

const app = express();
// 아래의 app.use(express.json())를 해줘야 express가 JSON데이터를 해석할 수 있따
// express는 순서대로 적용이 되니까 app.use(express.json())을 위쪽에 적용해줘야된다
// 옛날에는 bodyParser를 사용했따

app.use(express.json());
app.get("/boards", function (req, res) {
  // 1. DB에 접속 후 , 데이터를 조회
  // 근데 지금은 디비가 없으니까 DB를 조회했다고 가정하자
  // result를 DB에서 가져온 데이터라고 가정하자
  const result = [
    { number: 1, writer: "철수", title: "제목입니다", contents: "내용입니다" },
    { number: 2, writer: "영희", title: "제목입니다", contents: "내용입니다" },
    { number: 3, writer: "훈이", title: "제목입니다", contents: "내용입니다" },
  ];

  // 2. DB에서 꺼내온 결과를 브라우저에 응답 주기

  res.send(result);
});

app.post("/boards", function (req, res) {
  // 1. 브라우저에서 보내준 데이터 확인하기

  console.log(req);
  console.log("==================");
  console.log(req.body);

  // 2. DB에 접속 후 거기에 데이터를 저장 => 데이터 저장했다고 가정하기

  // 3. DB에 저장된 결과를 브라우저에 응답 주기
  res.send("게시물 등록에 성공하였습니다. ");
});

//
// 핸드폰 번호로 api만들기 실습
app.post("/tokens/phone", function (req, res) {
  // req.body.qqq에 핸드폰번호가 들어온다
  const isValid = checkPhone(req.body.qqq);
  if (isValid === false) return;

  // 2. 핸드폰 토큰 6자리 만들기 (인증번호 6자리)
  const myToken = getToken();

  // 3. 해당 핸드폰 번호로 토큰 전송하기
  sendTokenToSMS(req.body.qqq, myToken);

  res.send("인증완료오 후 변경!");
});

app.listen(3000);

// 퀴즈
// 1. postman에서 핸드폰 번호 입력하고, 그상태에서 send누르면 요청이 날아가고, req.body.qqq하면 핸드폰번호가 나오도록하기
// 2. 함수들import하기

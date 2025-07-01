// express로 rest api를 만들어보자

// const express = require('express') // 이건 옛날 방식 : commonjs
import express from "express";
// 이건 요즘방식 : module

const app = express();

// app.get은 get방식의 api를 만들겠다는 뜻
// 엔드포인트는 /qqq로 하겠다.그 엔드포인트로 누가 요청을 하면 function부분의 함수를 실행시키겠다는 뜻 => 이때 이 함수를 "미들웨어 함수"라고 부른다
app.get("/qqq", function (req, res) {
  res.send("Hello World");
});

// app.listen안에 있는 숫자는 포트번호
// listen은 기다린다는 뜻. 브라우저에서 특정 데이터를 요청하는걸 기다린다
// 예를 들어 포스트맨에서 SEND하는걸 기다린다/
// 이 코드를 실행하고 기다리는 상태가 켜져있는 상태에서 포스트맨 요청을 해보면, http://localhost:3000/qqq로 요청을 보내는거고 그안에 있는 함수가 동작하면서 응답으로 hello world를 포스트맨에 보내준다. 그러면 응답값에 그게 뜬다
// node index.js실행을 끄면 이 과정이 안된다. 무조건 켜져있어야 이게 된다

// 미들웨어함수 안에 있는 값을 바꾸면 서버를 다시 껐다 켜야된다

// 더 만들고 싶으면 app.get함수를 계속 만들면 된다

app.listen(3000);

// yarn에 대한 깊은 설명
// package.json에는 다운로드한 히스토리만 dependencies에 저장된다
// 구체적인 설치파일은 node_modules에 저장된다 -> 따라서 이걸 지우면 라이브러리들이 없는 것과 마찬가지이다
// package.json에 있는 내용을 다시 설치하고 싶으면 yarn install을 하면되고, 그 위치는 package.json이 있는 곳에서 하면 된다

// node_modules에 들어있는 다른 라이브러리들은 내가 다운 받은 걸 만든 사람이 사용한 라이브러리!

// yarn.lock은 버전관리하는 파일
// package.json과 다른 점은 내가 다운 받은 걸 만든 사람이 사용한 '다른' 라이브러리에 대한 버전 정보도 함께 들어가있다는 것!

// 깃허브에 node_modules는 올리지 않는다! 언제든이 다운로드 받을 수 있으니까
// 이걸 위해 .gitignore파일을 만들고, 그안에 node_modules를 써주면 깃허브에 node_modules는 올리지 않게 된다
// pagkage.json이랑 yarn.lock은 반드시 깃허브에 올려줘야된다. 그래야 그걸보고 node_modules를 다운받을 수 있으니까

//
// express뿐만 아니라 새로운 기능 및 라이브러리에 대해 공부하고 싶다면, 책이나 강의보다는 '공식문서'를 봐라 (영어로 봐라)
// 대신 텍스트를 다 읽는게 아니라 코드만 빨리 보고 필요한 부분을 가져오는 연습을 하자
// get started, installation, introduction 부분을 빠르게 읽으면 대충 구성을 알 수 있따

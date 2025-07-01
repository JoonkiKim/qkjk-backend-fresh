// MVC방식의 폴더 구조를 알아보자

// Models는 몽고디비 스키마 만들었던 그 모델스
// Views는 브라우저로 보여지는 프론트엔드 부분. 우리는 백엔드이니까 쓸일이 없다
// Controllers가 우리가 사용할 API부분

// API단위별로 각 API안에 있는 함수들을 컨트롤러에 빼서 따로 분리해준다

// product관련함수는 product.controller.js에 빼준다

// 그리고 컨트롤러 폴더는 보통 그 안에 services폴더를 만들어서 꺼내서 사용한다
// 서비스의 핵심로직 , 다시 말해 비즈니스 로직을 담고 있는건 서비스 폴더이다!

import express from "express";

import { ProductController } from "./mvc/controllers/product.controller.js";

const app = express();

// [상품 API]
// 각각의 API안에 있던 함수내용들을 다 컨트롤러 쪽으로 빼주고, 클래스 형태로 import해와서 쓴다
const productController = new ProductController();
app.post("/products/buy", productController.buyProduct); // 상품 구매하기 API
// 이때 buyProduct()로 실행을 하면 안된다! 요청이 이 API에 도착하면 그때 실행해야된다
app.post("/products/refund", productController.refundProduct); // 상품 환불하기 API

// 게시판 API
// app.get("/boards/...")

app.listen(3000);

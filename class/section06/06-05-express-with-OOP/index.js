// 객체지향 프로그래밍을 express에 적용하는 실습하기

// 돈과 관련된 로직은 cash.js에 만들어놓고, 판매와 관련된 로직은 product.js에 만들어놓자

// 이렇게 기능을 모아둔 클래스를 "서비스" 라고 부른다

// 세부적인 로직은 클래스서비스로 분리해서 따로 만들어주고, import해와서 쓰는게 좋다

import express from "express";

import { CashService } from "./cash.js";
import { ProductService } from "./product.js";

const app = express();

// 상품 구매하기 API
app.post("/products/buy", (req, res) => {
  // 1. 가진 돈 검증하는 코드
  // 코드 길이가 줄어들었다
  const cashService = new CashService();
  // Boolean값에 대해서는 변수명 지을때 is, has를 앞에 붙여준다
  const hasMoney = cashService.checkValue();

  // 2. 판매 여부를 검증하는 코드
  const productService = new ProductService();
  const isSoldOut = productService.checkSoldOut();

  // 3. 상품 구매하는 코드
  if (hasMoney && !isSoldOut) {
    // 상품 구매 진행코드 어쩌구저쩌구
    res.send("상품 구매 완료");
  }
});

// 상품 환불하기 API
app.post("/products/refund", (req, res) => {
  // 1. 판매 여부를 검증하는 코드
  const productService = new ProductService();
  const isSoldOut = productService.checkSoldOut();

  // 2. 상품 환불하는 코드
  if (isSoldOut) {
    // 상품 환불하는 코드 어쩌구저쩌구
    res.send("상품 환불 완료");
  }

  res.send("Hello World");
});

app.listen(3000);

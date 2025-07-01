// 쿠폰 API를 통해 MVC방식의 편리함을 느껴보자

// product controller는 건드릴 필요도 없이 coupon controller를 금방 만들 수 있다

import express from "express";

import { ProductController } from "./mvc/controllers/product.controller.js";
import { CouponController } from "./mvc/controllers/coupon,controller.js";

const app = express();

// [상품 API]

const productController = new ProductController();
app.post("/products/buy", productController.buyProduct);
app.post("/products/refund", productController.refundProduct);

// [쿠폰 API]
const couponController = new CouponController();
app.post("/coupons/buy", couponController.buyCoupon); // 상품권을 돈 주고 구매하는 API

// 게시판 API
// app.get("/boards/...")

app.listen(3000);

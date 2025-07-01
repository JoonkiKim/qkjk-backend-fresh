// 의존성 주입에 대해서 알아보자
// product 컨트롤러에서 필기 보기

import express from "express";

import { ProductController } from "./mvc/controllers/product.controller.js";
import { CouponController } from "./mvc/controllers/coupon.controller.js";
import { CashService } from "./mvc/controllers/services/cash.service.js";
import { ProductService } from "./mvc/controllers/services/product.service.js";
import { PointService } from "./mvc/controllers/services/point.service.js";

const app = express();

const cashService = new CashService();
const productService = new ProductService();
const pointService = new PointService();

// [상품 API]

// 두개를 하고 싶으면 이렇게 인자를 두개를 넣어주면 된다
const productController = new ProductController(cashService, productService);
app.post("/products/buy", productController.buyProduct);
app.post("/products/refund", productController.refundProduct);

// [쿠폰 API]

// 여기서 만약에 현금이 아니라 포인트 결제로 바꾸고 싶다면 cashService를 pointService로 바꿔주기만 하면 모든 코드가 한번에 수정된다
const couponController = new CouponController(pointService);
app.post("/coupons/buy", couponController.buyCoupon);

// 게시판 API
// app.get("/boards/...")

app.listen(3000);

import mongoose from "mongoose";
import express from "express";
import { checkPhone, getToken, sendTokenToSMS } from "./phone.js";

import cors from "cors";
import { Token } from "./models/token.model.js";
import { isPhoneExist } from "./phone.js";

import { RegisterController } from "./controllers/register.controller.js";
import { CheckPhoneService } from "./controllers/services/checkPhone.service.js";
import { FetchUserService } from "./controllers/services/fetchUser.service.js";
import { SaveUserService } from "./controllers/services/saveUser.service.js";

const app = express();
app.use(express.json());
app.use(cors());

const checkPhoneService = new CheckPhoneService();
const fetchUserService = new FetchUserService();
const saveUserService = new SaveUserService();

const registerController = new RegisterController(
  checkPhoneService,
  fetchUserService,
  saveUserService
);

app.post("/users", registerController.registerUser);

app.get("/users", registerController.checkUser);

app.post("/tokens/phone", async function (req, res) {
  // {"phone": "01056193997"}

  console.log(req.body.phone);
  // 1. 핸드폰 번호 형식 검증
  const isValid = checkPhone(req.body.phone);
  if (isValid === false) return;

  // 2. 토큰 생성
  const myToken = getToken();

  // 3. 핸드폰 번호 중복 확인
  const isAuth = await isPhoneExist(req.body.phone);

  // 4. 토큰 업데이트 처리
  if (isAuth) {
    // 핸드폰 번호가 이미 존재한다면, 기존 문서를 업데이트
    await Token.findOneAndUpdate(
      { phone: req.body.phone }, // 조건
      { token: myToken } // 업데이트 내용
    );
    sendTokenToSMS(req.body.phone, myToken);
    res.send(
      `기존 핸드폰 번호인 ${req.body.phone}로 새로운 인증 문자가 전송되었습니다.`
    );
  } else {
    // 핸드폰 번호가 없다면, 새로운 문서 생성
    const tokenDB = new Token({
      token: myToken,
      phone: req.body.phone,
      isAuth: false,
    });
    await tokenDB.save();
    sendTokenToSMS(req.body.phone, myToken);
    res.send(`${req.body.phone}으로 인증 문자가 전송되었습니다.`);
  }
});

// 핸드폰 번호와 토큰이 일치하면 핸드폰 인증 완료!
app.patch("/tokens/phone", async function (req, res) {
  const { phone, token } = req.body;

  // 1. 요청 데이터 검증
  if (!phone || !token) {
    return res.status(400).send("핸드폰 번호와 토큰을 모두 입력해주세요.");
  }

  try {
    // 2. DB에서 핸드폰 번호로 문서 조회

    // 특정 데이터로 필터링해서 어떤걸 불러오려면
    // 전화번호로 필터링해서 토큰을 불러온다
    // Token.findOne({ phone }) 여기에서 phone으로 필터링을 하고, existingToken.token이렇게 토큰을 불러온다
    const existingToken = await Token.findOne({ phone });

    if (!existingToken) {
      // 3. 핸드폰 번호가 없으면 false 반환
      return res.send(false);
    }

    //
    // 4. 토큰이 일치하지 않으면 false 반환
    if (existingToken.token !== token) {
      return res.send(false);
    }

    // 5. 토큰이 일치하면 isAuth 업데이트
    existingToken.isAuth = true;
    await existingToken.save();

    // 6. 성공적으로 업데이트 후 true 반환
    res.send(true);
  } catch (error) {
    console.error("Error processing request:", error);
    res.status(500).send("서버 에러가 발생했습니다.");
  }
});

// mongoose.set("debug", true);

mongoose
  .connect("mongodb://my-database:27017/mydocker")
  .then(() => console.log("db접속 성공!"))
  .catch(() => console.log("db접속에 실패하였습니다"));

app.listen(3000);

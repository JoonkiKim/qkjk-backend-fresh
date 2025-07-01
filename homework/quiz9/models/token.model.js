// 스키마를 만들어보자

import mongoose from "mongoose";

const tokenSchema = new mongoose.Schema({
  token: String,
  phone: String,
  isAuth: Boolean,
});

export const Token = mongoose.model("Token", tokenSchema);
// 이름은 Board이고, boardSchema가 들어있는 모델이다

// 이게 DB에 저장되면 컬렉션이 되는거임

// 스키마를 만들어보자

import mongoose from "mongoose";

const boardSchema = new mongoose.Schema({
  writer: String,
  title: String,
  contents: String,
});

export const Board = mongoose.model("Board", boardSchema);
// 이름은 Board이고, boardSchema가 들어있는 모델이다

// 이게 DB에 저장되면 컬렉션이 되는거임

import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  personal: String,
  prefer: String,
  pwd: String,
  phone: String,
  og: {
    title: String,
    description: String,
    image: String,
  },
});

export const User = mongoose.model("User", userSchema);
// 이름은 Board이고, boardSchema가 들어있는 모델이다

// 이게 DB에 저장되면 컬렉션이 되는거임

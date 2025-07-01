// 비동기 데이터를 동기적으로 가져오는 방법을 연습해보자
import axios from "axios";

// 비동기 방식
// 비동기 함수의 디폴트인 비동기적으로 데이터를 받아오려고 하는 함수
// function fetchAsync() {
//   const result = axios.get("https://koreanjson.com/posts/1");
//   console.log("비동기적으로 가져온 값 :", result); // Promis {<pending>} 이라는 값이 찍힘
// }

// 화살표 함수를 통해 함수 이름 중복을 막을 수 있다!!
const fetchAsync = () => {
  const result = axios.get("https://koreanjson.com/posts/1");
  console.log("비동기적으로 가져온 값 :", result); // Promis {<pending>} 이라는 값이 찍힘
};

// 동기 방식
// 비동기 함수의 디폴트를 async await를 사용해서 동기적으로 데이터를 받아오려고 하는 함수
// 함수 중복선언 문제를 피하기 위해 화살표함수로 변경
// async function fetchSync() {
//   const result = await axios.get("https://koreanjson.com/posts/1");
//   console.log("동기적으로 가져온 값 :", result); // 제대로 된 결과가 들어옴

//   console.log("동기적으로 가져온 값 :", result.data.title);
// }

const fetchSync = async () => {
  try {
    const result = await axios.get(
      "https://jsonplaceholder.typicode.com/todos/1"
    );
    console.log("동기적으로 가져온 값 :", result.data);
  } catch (error) {
    console.error("데이터를 가져오는 중 오류 발생:", error.message);
  }
};

fetchAsync();
fetchSync();

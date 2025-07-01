console.log("안녕하세요");

// 랜덤 숫자 토큰 만들기
function getToken() {
  const result = String(Math.floor(Math.random() * 1000000)).padStart(6, "0");
  console.log(result);
}

getToken();

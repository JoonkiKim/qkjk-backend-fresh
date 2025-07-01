const fetchData = async () => {
  // API 보내기 요청!!

  // new Promise부분을 axios라고 가정하는거임 -> axios에 await붙여주는 것처럼 동일하게 작성해주면
  //
  const result = await new Promise((성공시함수, 실패시함수) => {
    // setTimeout은 그냥 시간 오래걸리는거 구현한거라고 생각하면 됨
    setTimeout(() => {
      try {
        console.log("이미지 받아왔다~"); // 5초 뒤에 이미지 받아옴
        성공시함수("강아지.jpg"); // 여기 "강아지.jpg"를 써주면 result변수에 그 값이 담김
      } catch (error) {
        실패시함수("실패했습니다!!!");
      }
    }, 5000);
  });

  console.log(result);

  console.log("받아온 강아지.jpg 브라우저에 전달!");
};

fetchData();

// new Promise없이 요청하면 "받아온 강아지.jpg 브라우저에 전달!" -> "이미지 받아왔다~"의 순서로 값이 나와서 우리가 원하는 순서대로 작동을 안함
// "이미지 받아왔다~" 가 될때까지 기다리기 위해서 new Promise를 새로 만들어주는거임

// new Promise도 await axios처럼 안쪽의 함수실행이 끝나기 전까지 밑으로 안 내려간다

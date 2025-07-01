// promise all에 대해 알아보자 -> 훨씬 더 빠르다!

// 두 함수의 실행시간을 비교해보면 Promise.all()을 적용한 함수가  더 빠르게 실행되는 것을 알 수 있습니다

const fetchData = async () => {
  console.time("=== 개별 Promise 각각 ===");
  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("성공!!");
    }, 2000);
  });

  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("성공!!");
    }, 3000);
  });

  await new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve("성공!!");
    }, 1000);
  });
  console.timeEnd("=== 개별 Promise 각각 ===");
};

fetchData();

// 이게 promise all
const fetchData2 = async () => {
  console.time("=== 한방 Promise.all ===");
  // await Promise.all( [new Promise(), new Promise(), new Promise()] ) 이런형태로 구성되어있는거임
  // await는 Promise.all에만 붙여준다!
  const result = await Promise.all([
    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("성공!!");
      }, 2000);
    }),

    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("성공!!");
      }, 3000);
    }),

    new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("성공!!");
      }, 1000);
    }),
  ]);
  console.log(result);
  console.timeEnd("=== 한방 Promise.all ===");
};

fetchData2();

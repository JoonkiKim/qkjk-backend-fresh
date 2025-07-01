// 큰 일감이 있으면 워커스레드를 열어서 거기에 던져주면된다!

// 아래의 코드를 통해 한 마리가 9000000000씩 처리하던걸 9명이 1000000000씩 나눠서 처리하게 되는거다!

// index.js

import { Worker } from "worker_threads";

const start = () => {
  let totalSum = 0;

  for (let i = 0; i < 9; i++) {
    // 이렇게 해주면 워커가 9마리가 생긴다
    const worker = new Worker("./worker.js");
    worker.postMessage(1000000000); // 여기 넣어준 1000000000라는 값이 worker.js의 매개변수에 들어간다
    worker.on("message", (result) => {
      totalSum += result;
      console.log(`나는 ${i}번째 일꾼이고, 현재까지 총 합은 ${totalSum}이야!!`);
    });
  }
};

start();

// 정리하면 자바스크립트에서 계산할게 많은 경우에 워커스레드를 사용해서 메인스레드가 최대한 일을 많이 안하게 해주는게 좋다

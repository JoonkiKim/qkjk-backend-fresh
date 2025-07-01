// worker.js

import { parentPort } from "worker_threads";

// index.js에서 worker.postMessage(1000000000);로 보내주는 1000000000라는 값이 maxSize자리에 들어감, 매개변수니까 이름은 바꿔도 됨
parentPort.on("message", (maxSize) => {
  let sum = 0;
  for (let i = 0; i < maxSize; i++) {
    sum += 1;
  }
  parentPort.postMessage(sum); // 여기서 계산한 sum을 index.js의 worker.on("message", (result) 에서 result로 받는다
  parentPort.close();
});

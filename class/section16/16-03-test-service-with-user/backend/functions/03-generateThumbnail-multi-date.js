// // 썸네일을 자동으로 저장해주는 Cloud Storage 트리거
// // 날짜도 추가해보자
// // 이건 files.service에서 이름을 만들때 애초에 date를 추가해보자

// const { Storage } = require('@google-cloud/storage');
// const sharp = require('sharp');
// const functions = require('@google-cloud/functions-framework');

// functions.cloudEvent('helloGCS', async (cloudEvent) => {
//   const { bucket, name, contentType, size } = cloudEvent.data || {};
//   if (!bucket || !name) {
//     console.log('[스킵] CloudEvent data 누락');
//     return;
//   }

//   console.log(`Finalize 이벤트 수신: ${bucket}/${name}`);
//   console.log(`MIME: ${contentType}, Size: ${size}B`);

//   // 무한 트리거 방지
//   if (name.startsWith('thumb/')) return;

//   const origin = new Storage().bucket(bucket); // 원본 버킷
//   const thumbs = new Storage().bucket('qkjk-backend-practice-thumb'); // 썸네일 버킷

//   // /origin/을 기준으로 이름 앞쪽은 prefix , 뒷쪽은 postfix에 넣어보자
//   const prefix = name.split('/origin/')[0];
//   const postfix = name.split('/origin/')[1];

//   // 썸네일 규격 목록
//   const variants = [
//     { width: 320, thumbName: `${prefix}/thumb/s/${postfix}` },
//     { width: 640, thumbName: `${prefix}/thumb/m/${postfix}` },
//     { width: 1280, thumbName: `${prefix}/thumb/l/${postfix}` },
//   ];

//   // 각 썸네일을 만드는 Promise 생성 함수
//   const createThumb = ({ width, thumbName }) =>
//     new Promise((resolve, reject) => {
//       origin
//         .file(name)
//         .createReadStream()
//         .pipe(sharp().resize({ width })) // 리사이즈
//         .pipe(
//           thumbs
//             .file(`${thumbName}`) // 썸네일 저장 경로
//             .createWriteStream(),
//         )
//         .on('finish', resolve)
//         .on('error', reject);
//     });

//   // 모든 썸네일을 병렬로 생성(promise.all사용!)
//   // 아래의 코드에서 배열과 함수를 width, thumbName로 연결해주는거임
//   await Promise.all(variants.map(createThumb));

//   console.log('썸네일 생성 완료');
// });

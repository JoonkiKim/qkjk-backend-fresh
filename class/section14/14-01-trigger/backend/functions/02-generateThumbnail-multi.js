// // 썸네일을 자동으로 저장해주는 Cloud Storage 트리거
// // 사이즈별로 저장해보자
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

//   // 썸네일 규격 목록
//   const variants = [
//     { width: 320, prefix: 's' },
//     { width: 640, prefix: 'm' },
//     { width: 1280, prefix: 'l' },
//   ];

//   // 각 썸네일을 만드는 Promise 생성 함수
//   const createThumb = ({ width, prefix }) =>
//     new Promise((resolve, reject) => {
//       origin
//         .file(name)
//         .createReadStream()
//         .pipe(sharp().resize({ width })) // 리사이즈
//         .pipe(
//           thumbs
//             .file(`thumb/${prefix}/${name}`) // 썸네일 저장 경로
//             .createWriteStream(),
//         )
//         .on('finish', resolve)
//         .on('error', reject);
//     });

//   // 모든 썸네일을 병렬로 생성
//   await Promise.all(variants.map(createThumb));

//   console.log('썸네일 생성 완료');
// });

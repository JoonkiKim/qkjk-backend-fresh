// 썸네일을 자동으로 저장해주는 썸네일 트리거 설정해보자
// 이 코드는 cloud function의 소스에 올려주는거임!
// 여기 저장해두는 이유는 어떤 코드를 썼는지 확인하기 위해서
// 여기는 일단 작게 만들기

const { Storage } = require('@google-cloud/storage');
const sharp = require('sharp');
const functions = require('@google-cloud/functions-framework');

functions.cloudEvent('helloGCS', async (cloudEvent) => {
  const { bucket, name, contentType, size } = cloudEvent.data;
  if (!bucket || !name) {
    console.log('[스킵] CloudEvent data 누락');
    return;
  }

  console.log(`Finalize 이벤트 수신: ${bucket}/${name}`);
  console.log(`MIME: ${contentType}, Size: ${size}B`);

  // 무한 트리거 방지
  if (name.startsWith('thumb/')) return;

  // 2. 썸네일 생성 준비
  // 이건 기존 스토리지
  const origin = new Storage().bucket(bucket);
  // 얘는 썸네일을 담아둘 스토리지 -> 이걸 안하고 기존 스토리지에 요청하면 무한 트리거가 발생한다
  const thumbs = new Storage().bucket('qkjk-backend-practice-thumb');

  // 여기서의 name은 위의 cloudEvent.data에서 가져온것
  await new Promise((res, rej) => {
    origin
      .file(name)
      .createReadStream() // 3. 파일 불러오기
      .pipe(sharp().resize({ width: 320 })) // 4. 파일크기 변경하기 (sharp라이브러리사용 / 가로 넓이 기준으로 줄이는게 가장 좋다, 그럼 세로는 알아서 그 비율에 맞게 줄어든다)
      .pipe(
        thumbs // 썸네일 스토리지('qkjk-backend-practice-thumb')에 저장하기
          .file(`thumb/${name}`) // 변경할 파일명
          .createWriteStream(),
      )
      .on('finish', res)
      .on('error', rej);
  });

  console.log('썸네일 생성 완료');
});

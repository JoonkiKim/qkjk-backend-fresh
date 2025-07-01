// 메타태그에 og태그 배웠던거를 백엔드 개발자 입장에서 활용해보자
// FE에서 og를 넣어놨다면, BE에서는 그걸 긁어와서 내 프로덕트에서 보여줘야됨. 그 과정을 cheerio를 통해 해보자

// 배열에 담아서 순서대로 추출하는 방법까지 해보자
import axios from "axios";
import cheerio from "cheerio";

const createMessage = async () => {
  const url = "https://www.naver.com";

  const result = await axios.get(url);
  const $ = cheerio.load(result.data);

  const ogData = {}; // 데이터를 저장할 객체

  $("meta").each((index, el) => {
    const key = $(el).attr("property");
    const value = $(el).attr("content");

    if (key && key.includes("og:") && value) {
      const formattedKey = key.replace("og:", ""); // "og:" 제거
      ogData[formattedKey] = value; // 객체에 key-value 저장
    }
  });

  console.log(ogData.title); // 결과 출력
};

createMessage();

// 아래와 같이 추출됨
// {
//   title: '네이버',
//   url: 'https://www.naver.com/',
//   image: 'https://s.pstatic.net/static/www/mobile/edit/2016/0705/mobile_212852414260.png',
//   description: '네이버 메인에서 다양한 정보와 유용한 컨텐츠를 만나 보세요'
// }

// 이런 작업은 CORS이슈가 있으니까 대부분 백엔드개발자가 하게 된다

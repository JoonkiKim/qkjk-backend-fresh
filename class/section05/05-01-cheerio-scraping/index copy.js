// 메타태그에 og태그 배웠던거를 백엔드 개발자 입장에서 활용해보자
// FE에서 og를 넣어놨다면, BE에서는 그걸 긁어와서 내 프로덕트에서 보여줘야됨. 그 과정을 cheerio를 통해 해보자

import axios from "axios";
import cheerio from "cheerio";

const createMessage = async () => {
  // 내 프로덕트에 입력된 메시지 : "안녕하세요~ https://www.naver.com에 방문해주세요!"
  // 1. 입력된 메시지에서 http로 시작하는 문장이 있는지 먼저 찾기(카톡으로 뭔가 링크를 보내면 사이트 주소를 찾아서 미리보기를 보여주는 기능을 구현하기 위함) (.find 등의 알고리즘 사용하기)

  const url = "https://www.naver.com";

  // 2. axios.get으로 https://www.naver.com에 데이터를 요청해서 html코드를 일단 받아오기 => "스크래핑"
  const result = await axios.get(url);
  //   console.log(result.data);

  // 3. 스크래핑 결과에서 OG(오픈그래프)코드를 골라내서 변수에 담기 => cheerio 도움받기
  // 자세한 방법은 cheerio 사이트의 독스 들어가서 확인하기
  // cheerio에서는 데이터를 받아올때 $로 받아온다
  const $ = cheerio.load(result.data);
  // "meta"라고 써주면 메타 태그만 뽑아오고, each를 붙이면 그 메타 태그들에 대해서 특정 행동을 반복해줌
  // each는 map이랑 비슷한건데, index,el 순서로 들어옴(map은 el index 순서로 들어옴) / 자바스크립트 내장 함수 이런게 아니고 cheerio에서 제공하는 기능이다
  $("meta").each((index, el) => {
    // meta태그에서 속성이 property이고, og: 를 포함하고 있는지 필터링
    if ($(el).attr("property") && $(el).attr("property").includes("og:")) {
      const key = $(el).attr("property"); // og:title, og:description ~ 이런 애들을 뽑아오고고
      const value = $(el).attr("content"); // 그런 애들 중에 content가 붙어있는 애들 (네이버, 네이버 메인에서 어쩌구저쩌구 이런 텍스트를 가져온다)

      // console.log()
    }
  });
};

createMessage();

// 이런 작업은 CORS이슈가 있으니까 대부분 백엔드개발자가 하게 된다

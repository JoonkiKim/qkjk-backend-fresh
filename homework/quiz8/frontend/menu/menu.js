// 커피 목록 조회 API를 요청해주세요.
export const getCoffee = async () => {
  try {
    // 1. 백엔드 서버로 /starbucks API 요청해 커피 데이터를 받는다.
    const response = await axios.get("http://localhost:3000/starbucks");
    const coffeeList = response.data;

    // 2. 받은 데이터로 createMenuCard 함수를 이용해 메뉴 카드를 모두 만들어주세요.
    coffeeList.forEach((coffee) => createMenuCard(coffee));
  } catch (error) {
    console.error("커피 목록을 가져오는 중 오류가 발생했습니다:", error);
  }
};
const createMenuCard = (data) => {
  const menuCardWrapper = document.createElement("div");
  menuCardWrapper.className = "Menu_Card_Wrapper";

  const menuCardImgBox = document.createElement("div");
  menuCardImgBox.className = "Menu_Card_ImgBox";

  const menuCardName = document.createElement("div");
  menuCardName.className = "Menu_Card_Name";
  menuCardName.textContent = data?.name || "메뉴이름";

  const menuCardInfo = document.createElement("div");
  menuCardInfo.className = "Menu_Card_Info";
  menuCardInfo.textContent = `${data?.kcal || "칼로리"} kcal`;

  const menuWrapper = document.querySelector("#Menu_Background");
  menuCardWrapper.appendChild(menuCardImgBox);
  menuCardWrapper.appendChild(menuCardName);
  menuCardWrapper.appendChild(menuCardInfo);
  menuWrapper.appendChild(menuCardWrapper);
};

window.getUser = async () => {
  try {
    const result = await axios.get("http://localhost:3000/users");
    console.log(result.data);

    // 여러 회원 정보를 한 번에 추가하기 위해 기존 내용을 초기화
    const menuBack = document.querySelector("#User_Data_Wrapper");
    menuBack.innerHTML = "";

    result.data.forEach((user) => createUserDiv(user));
  } catch (error) {
    console.error("회원 목록을 불러오는 중 오류 발생:", error);
  }
};

window.createUserDiv = (user) => {
  const userWrapper = document.createElement("div");
  userWrapper.className = "User_Wrapper";

  // 첫째 줄 - 기본 회원 정보
  const userTableItem = document.createElement("div");
  userTableItem.className = "User_Table_Item";

  const emailItem = document.createElement("div");
  emailItem.className = "Item_Info";
  emailItem.textContent = user?.email || "abc@gmail.com";

  const personalItem = document.createElement("div");
  personalItem.className = "Item_Info";
  personalItem.textContent = user?.personal || "000000";

  const phoneItem = document.createElement("div");
  phoneItem.className = "Item_Info";
  phoneItem.textContent = user?.phone || "010-1234-5678";

  const preferItem = document.createElement("div");
  preferItem.className = "Item_Info";
  preferItem.textContent = user?.prefer || "naver.com";

  userTableItem.appendChild(emailItem);
  userTableItem.appendChild(personalItem);
  userTableItem.appendChild(phoneItem);
  userTableItem.appendChild(preferItem);

  // 둘째 줄 - og 정보
  const ogTableItem = document.createElement("div");
  ogTableItem.className = "User_Table_Item";

  const ogTitle = document.createElement("div");
  ogTitle.className = "Item_Info";
  ogTitle.textContent = user?.og?.title || "제목 없음";

  const ogDescription = document.createElement("div");
  ogDescription.className = "Item_Info";
  ogDescription.textContent = user?.og?.description || "설명 없음";

  const ogImage = document.createElement("img");
  ogImage.className = "Og_Image";
  ogImage.src = user?.og?.image || "";
  ogImage.alt = "OG 이미지";
  ogImage.style.width = "50px";
  ogImage.style.height = "50px";

  ogTableItem.appendChild(ogImage);
  ogTableItem.appendChild(ogTitle);
  ogTableItem.appendChild(ogDescription);

  userWrapper.appendChild(userTableItem);
  userWrapper.appendChild(ogTableItem);

  const menuBack = document.querySelector("#User_Data_Wrapper");
  menuBack.appendChild(userWrapper);
};

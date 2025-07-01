window.getValidationNumber = async () => {
  const phonePart1 = document.getElementById("PhoneNumber01").value;
  const phonePart2 = document.getElementById("PhoneNumber02").value;
  const phonePart3 = document.getElementById("PhoneNumber03").value;

  const fullPhoneNumber = phonePart1 + phonePart2 + phonePart3;

  console.log("합쳐진 전화번호:", fullPhoneNumber);

  try {
    const result = await axios.post("http://localhost:3000/tokens/phone", {
      phonenumber: fullPhoneNumber,
    });
    console.log(result.data);
  } catch (error) {
    console.error("Error sending phone number:", error);
  }

  document.querySelector("#ValidationInputWrapper").style.display = "flex";
  console.log("인증 번호 전송");
};

// 회원 가입 API 요청
window.submitSignup = async () => {
  // 이름, 주민등록번호, 핸드폰 번호, 좋아하는 사이트, 비밀번호, 이메일
  const name = document.getElementById("SignupName").value;

  const idnumber = document.getElementById("SignupPersonal").value;

  const phonePart1 = document.getElementById("PhoneNumber01").value;
  const phonePart2 = document.getElementById("PhoneNumber02").value;
  const phonePart3 = document.getElementById("PhoneNumber03").value;

  const fullPhoneNumber = phonePart1 + phonePart2 + phonePart3;

  const preference = document.getElementById("SignupPrefer").value;

  const email = document.getElementById("SignupEmail").value;

  const password = document.getElementById("SignupPwd").value;

  try {
    const result = await axios.post("http://localhost:3000/usersemail", {
      name,
      idnumber,
      preference,
      email,
      password,
      phonenumber: fullPhoneNumber,
    });
    console.log(result.data);
  } catch (error) {
    console.error("Error sending phone number:", error);
  }

  console.log("회원 가입 이메일 전송");
};

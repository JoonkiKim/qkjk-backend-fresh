window.isAuth = false;
// 핸드폰 인증 여부는 전역변수로 선언하기
// 기본 html에서 전역변수 선언하려면 window를 사용하면 된다

// 휴대폰 인증 토큰 전달하기

window.getValidationNumber = async () => {
  const phonePart1 = document.getElementById("PhoneNumber01").value;
  const phonePart2 = document.getElementById("PhoneNumber02").value;
  const phonePart3 = document.getElementById("PhoneNumber03").value;
  const fullPhoneNumber = phonePart1 + phonePart2 + phonePart3;
  console.log("합쳐진 전화번호:", fullPhoneNumber);

  try {
    const result = await axios.post("http://localhost:3000/tokens/phone", {
      phone: String(fullPhoneNumber),
    });
    console.log(result.data);
  } catch (error) {
    console.error("Error sending phone number:", error);
  }

  document.querySelector("#ValidationInputWrapper").style.display = "flex";
  console.log("인증 번호 전송");
};

window.submitToken = async () => {
  const phonePart1 = document.getElementById("PhoneNumber01").value;
  const phonePart2 = document.getElementById("PhoneNumber02").value;
  const phonePart3 = document.getElementById("PhoneNumber03").value;
  const fullPhoneNumber = phonePart1 + phonePart2 + phonePart3;
  const submittedToken = document.getElementById("TokenInput").value;
  try {
    const isAuth = await axios.patch("http://localhost:3000/tokens/phone", {
      phone: fullPhoneNumber,
      token: submittedToken,
    });
    console.log("인증완료 여부는" + isAuth.data);

    window.isAuth = isAuth.data;
    if (!window.isAuth) {
      alert("인증 정보가 틀렸습니다");
    } else {
      document.getElementById("NumberVailidationChange").textContent =
        "인증완료";
    }
  } catch (error) {
    console.error(error);
  }

  document.querySelector("#ValidationInputWrapper").style.display = "flex";
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

  console.log("블록 바깥쪽에서 응답" + window.isAuth);
  if (!window.isAuth) {
    console.log("블록 안쪽에서 응답" + window.isAuth);
    alert("핸드폰 인증이 완료되지 않았습니다");
    return;
  }

  // 포스트맨에서 보내는 것처럼 스키마에 맞게 여기서 axios를 보내줘야된다
  try {
    const result = await axios.post("http://localhost:3000/users", {
      name: name,
      email: email,
      personal: idnumber,
      prefer: preference,
      pwd: password,
      phone: fullPhoneNumber,
    });
    console.log(result.data);
    console.log("회원 가입 이메일 전송");
    alert("회원가입이 완료되었습니다!");
  } catch (error) {
    console.log("Error sending phone number:", error);
  }
};

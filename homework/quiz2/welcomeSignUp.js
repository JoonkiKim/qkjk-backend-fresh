import { customRegistrationNumber } from "./rgnumber.js";

function welcomeTemplate({ email, rgnumber, phoneNumber, favoriteSite }) {
  const mytemplate = `
           <html>
                <body>
                    <h1>코드캠프 가입을 환영합니다!!!</h1>
                    <hr />
                    <div>이메일: ${email}</div>
                    <div>주민번호: ${rgnumber}</div>
                    <div>휴대폰 번호: ${phoneNumber}</div>
                    <div>좋아하는 사이트: ${favoriteSite}</div>
                </body>
            </html>
        `;

  console.log(mytemplate);
}

// 이메일, 주민번호, 휴대폰 번호, 내가 좋아하는 사이트
const email = "q@q.com";
const rgnumber = customRegistrationNumber("001122-1234567");
const phoneNumber = "01056193998";
const favoriteSite = "naver.com";

welcomeTemplate({ email, rgnumber, phoneNumber, favoriteSite });

import { User } from "../../models/user.model.js";
import {
  maskLastSeven,
  ogDataScrapping,
  sendWelcomeToEmail,
  welcomeTemplate,
} from "../../utils.js";

// 서비스에서도 utils를 통해 함수를 끌어올 수 있다
// 서비스라고 해서 그 안에서 모든 함수를 만들어야 하는건 아니다

// 유저 등록하는 서비스

export class SaveUserService {
  saveUser = async (req, res) => {
    // 2. 사이트에 데이터 요청 날리고 og태그의 내용 긁어오기
    const ogData = await ogDataScrapping(req.body.prefer);

    // 3. 주민번호 뒷자리 *로 만들기
    const persnoalMasked = maskLastSeven(req.body.personal);

    // 4. DB에 저장하기
    const userDB = new User({
      name: req.body.name,
      email: req.body.email,
      personal: persnoalMasked,
      prefer: req.body.prefer,
      pwd: req.body.pwd,
      phone: req.body.phone,
      og: {
        title: ogData.title,
        description: ogData.description,
        image: ogData.image,
      },
    });

    const userData = await userDB.save();

    // 4. 회원가입 환영 이메일 전송하기
    const { name, email, prefer } = req.body;
    const welcome = welcomeTemplate({
      name,
      email,
      prefer,
    });

    sendWelcomeToEmail(email, welcome);

    return userData;
  };
}

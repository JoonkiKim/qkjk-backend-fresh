export class RegisterController {
  checkPhoneService;
  fetchUserService;
  saveUserService;

  constructor(checkPhoneService, fetchUserService, saveUserService) {
    this.checkPhoneService = checkPhoneService;
    this.fetchUserService = fetchUserService;
    this.saveUserService = saveUserService;
  }

  // 유저 등록하기
  registerUser = async (req, res) => {
    // 1. 핸드폰 인증 여부 확인
    const isPhoneAuth = this.checkPhoneService.checkPhoneNumber(req.body.phone);
    if (!isPhoneAuth) {
      res.status(422).send("에러!! 핸드폰 번호가 인증되지 않았습니다");
    }

    // 2. 인증여부 확인 후 유저 등록하기
    const users = await this.saveUserService.saveUser(req);
    res.status(201).json(users._id);
  };

  // 유저 리스트 조회하기
  checkUser = async (req, res) => {
    try {
      const users = await this.fetchUserService.fetchUser();
      res.status(200).json(users); // 응답
      // 응답을 문자열이랑 섞으면 이상한 모양으로 나오니까 따로 받자
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "서버 에러가 발생했습니다." });
    }
  };
}

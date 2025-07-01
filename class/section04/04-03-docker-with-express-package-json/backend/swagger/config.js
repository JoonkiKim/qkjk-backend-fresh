export const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "나의 API 설명서",
      // title은 api doc페이지의 제목
      version: "1.0.0",
    },
  },
  apis: ["./swagger/*.swagger.js"], // swagger폴더 안에 ~.swagger.js라고 생긴 모든 파일을 api독스로 인식한다는 뜻
};

// graphql로 api랑 docs를 만들어보자

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";

// typeDef가 docs
const typeDefs = `#graphql

# 입력값에 대한 타입은 input이라 써주고, 아래처럼 응답값에 대한 타입은 type이라 써준다
input CreateBoardInput {
  writer: String,
  title: String,
  contents: String

}


# 응답값에 대한 타입은 type이라 써준다
# 이렇게 객체 하나에 대한 타입도 만들 수 있다
type MyResult {
  number: Int,
  writer: String,
  title: String,
  contents: String

}

type Query {
    fetchBoards: [MyResult]
    # fetchBoards는 MyResult라는 객체로 이루어진 배열이니까 [MyResult]로 써준다

    # fetchBoards: MyResult
    # 위에처럼 객체 하나만 있으면 응답값이 객체 하나라는 뜻


    
}

type Mutation {
    # createBoard(writer: String, title: String, contents: String!): String
    # createBoard의 오른쪽에 써주는건 return값에 대한 타입
    # 괄호안에 써주는건 mutation의 입력값들에 대한 타입
    # 필수로 바꾸고 싶으면 느낌표 넣어주기
    # 맨 위에서 CreateBoardInput으로 writer: String, title: String, contents: String!를 묶어줄거임

    createBoard(createBoardInput: CreateBoardInput!): String
    
}
`;

// ==================================================================================================
// resolvers가 api

const resolvers = {
  Query: {
    // graphql은 아래의 네 개가 매개변수로 들어온다 : parent, args, context, info
    // args안에 데이터가 들어온다.
    // context 안에 req, res가 들어옴
    // info 에는 graphql에 대한 전반적인 정보가 들어옴
    // parent는 백엔드에서 백엔드로 요청을 할때 요청하는 내용이 parent안에 담겨서 들어간다

    // ** 대부분 args만 사용한다
    // 사용하지 않는건 언더바 해준다 _
    fetchBoards: (_, args, context, info) => {
      // result를 DB에서 가져온 데이터라고 가정하자
      const result = [
        {
          number: 1,
          writer: "철수",
          title: "제목입니다",
          contents: "내용입니다",
        },
        {
          number: 2,
          writer: "영희",
          title: "제목입니다",
          contents: "내용입니다",
        },
        {
          number: 3,
          writer: "훈이",
          title: "제목입니다",
          contents: "내용입니다",
        },
      ];

      return result;
    },
  },

  // 매개변수에서 뒤에는 지울 수 있는데 앞에는 못지운다. 그래서 언더바를 해준다
  Mutation: {
    createBoard: (_, args) => {
      // 1. 브라우저에서 보내준 데이터 확인하기

      // args.위에서 만든 타입.그 안에 있는 구체적인 인풋값
      // 위와 같은 형태로 값을 뽑아오는거임
      // 아래의 콘솔 로그는 터미널에서 나오는거임
      console.log(args.createBoardInput.writer);
      console.log(args.createBoardInput.title);
      console.log(args.createBoardInput.contents);

      // 2. DB에 접속 후 거기에 데이터를 저장 => 데이터 저장했다고 가정하기

      // 3. DB에 저장된 결과를 브라우저에 응답 주기

      return "게시물 등록에 성공하였습니다.";
    },
  },
};

// -----------------------------------------------------------------------------
// 서버 실행해주는 부분

const server = new ApolloServer({
  // 숏핸드로 생략
  // typeDefs: typeDefs,
  // resolvers: resolvers,
  typeDefs,
  resolvers,
  cors: true, // 이건 모든 사이트에서 허용해주는 것
  // 아폴로서버에서는 cors따로 설치없이 그냥 cors 트루로 해주면된다
  // 특정 사이트만 허용해주고 싶으면 아래와 같이 해주면 된다
  // cors: { origin: ["https://naver.com"] },
});

startStandaloneServer(server);

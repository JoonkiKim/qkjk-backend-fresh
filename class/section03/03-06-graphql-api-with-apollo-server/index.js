// graphql에서 사용하는 apollo-server를 이용해서 통신해보자

import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
// express랑 ApolloServer랑 같은 역할이고, express에서 app.listen(3000);하는 부분이 startStandaloneServer랑 같다

const typeDefs = `#graphql
type Query {
    qqq: String
}

`;

const resolvers = {
  Query: {
    qqq: () => {
      return "프런트에 보내주는 응답값";
    },
  },
};

const server = new ApolloServer({
  // typeDefs는 docs 부분이고, resolvers가 api만드는 부분

  typeDefs: typeDefs,
  resolvers: resolvers,
});

// 위에서 독스랑 api를 만들고 여기서 실행해준다
// 얘는 기본적으로 4000포트로 실행된다
startStandaloneServer(server);

// 주소창에 http://localhost:4000/graphql 하면 플레이그라운드 같은 apollo 화면이 실행된다

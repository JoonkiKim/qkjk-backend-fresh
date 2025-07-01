# 도커를 더 효율적으로 구성해보자
# 아까 포트를 변경했을때 yarn install이 다시 실행되는 현상이 발생했음
# 캐싱을 했음에도 왜 다시 실행하는걸까?

# 왜냐면 도커는 위에서부터 캐싱을 쭉 하다가, 뭔가 변경 사항이 있어서 캐싱이 깨지기 시작하면 그 코드부터 밑에까지는 다 새로 실행함. COPY가 있는 코드에서 캐싱이 깨졌기 때문에 그 밑에는 yarn install도 새로 실행하면서 yarn install을 다시 실행했던거임

# FROM node:14
# COPY . /myfolder/
# WORKDIR /myfolder/
# RUN yarn install
# CMD yarn start:dev

# 따라서 위의 코드처럼 도커를 구성하면 package.json이 아닌 다른 파일을 수정했음에도 계속 yarn install을 새로 하게 됨 -> 비효율적이기 때문에 아래의 코드처럼 구성을 해준다

FROM node:14
COPY ./package.json /myfolder/
COPY ./yarn.lock /myfolder/
# 이렇게 위쪽에서 package.json과 yarn.lock을 먼저 카피해주면 얘네가 바뀌었을때만 새로 실행을 해주면 되니까 더 효율적이다
WORKDIR /myfolder/
RUN yarn install
# 이렇게 해주면 라이브러리 변경사항이 없으면 캐시에서 가져오니까 yarn install 반복 없이 모두 다 0초로 가져올 수 있다

# 코드 변경이 있으면 여기 부분만 캐싱이 깨지면서 새로 실행을 할거다
COPY . /myfolder/

CMD yarn start:dev



# 종료는 docker stop [컨테이너ID]
# 근데 이건 끈거지 없앤게 아님
# 꺼진 컴퓨터까지 보고 싶으면 docker ps -a
# 아예 삭제하고 싶으면 docker rm [컨테이너ID]
# 다 삭제하고 싶으면 컨테이너 아이디를 모두 가져와서 삭제해야됨
# docker rm `docker ps -a -q`
# 백틱``을 써주면 리눅스에서 그걸 먼저 실행해준다


# 그리고 이미지들도 남아있음, 
# 그걸삭제하는 방법은 docker rmi [이미지id]
# 한번에 삭제하려면 다 불러오고 삭제하기
# docker rmi `docker images -q`

# 이런 명령어들은 안전하게 작동하기 때문에 실행중인건 안 지워진다

# 컨테이너, 이미지, 네트워크, 캐시 등등을 완전 싹 다 제거하고 싶으면(켜져있는거 제외하고), 
# docker system prune -a

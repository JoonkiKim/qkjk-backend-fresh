# 도커 안에 express 파일을 복사한 다음 거기서 실행해보자

FROM node:14

# RUN mkdir myfolder
# COPY할때 폴더가 없으면 알아서 만들기 때문에 RUN을 해줄 필요는 없다

# 왼쪽의 점은 현 위치에 있는 모든 파일을 선택하겠다는뜻 / myfolder는 선택한 애들을 그 안에 넣겠다는 뜻
COPY . /myfolder/

# CMD yarn start:dev를 하려면 해당 폴더로 이동해야되는데 RUN으로 이동하는 방법이 있고, WORKDIR로 쉘을 이동시켜서 하는 방법이 있다 
# RUN cd ./myfolder/
WORKDIR /myfolder/

# node_modules를 도커 컴퓨터 안에서 설치하기 위해 yarn install을 여기서 한다
RUN yarn install


# package.json 안에 있는 서버실행 명령어는 yarn start:dev이니까 그걸 실행해준다
CMD yarn start:dev



# [dockerignore가 필요한 이유]
# node_modules를 내 컴퓨터 버전에 맞춰서 다운 받았는데, 그걸 도커로 옮기면 다들 각자의 버전으로 node를 갖고 있으니까 버전 에러남

# 해결방안은 1. node버전을 통일하거나 2. 도커 컴퓨터 안에서 yarn install을 하는 것
# 2번 방식을 할거고, 그걸 위해서 node-modules는 제외해줘야되니까 dockerignore라는 파일을 만들거 거기서 node-modules를 없앤다




# 도커 이미지 및 컨테이너(컴퓨터) 생성하는 방법
# 이렇게 세팅을 했으면 이미지를 만들자
# sudo docker build .

# 다 만들었으면 실행하자
# sudo docker run [이미지ID]
# "도커 컨테이너(컴퓨터) 안에서" yarn start:dev가 실행된다

# 근데 걍 접속하면 연결이 안된다
# 도커에서 포트 관련 문제가 발생한 것

# express를 실행한건 도커 컴퓨터 내부이고, 우리가 요청을 보내는건 내 컴퓨터의 3000번 포트인데, "내 컴퓨터 안에서 3000번 포트로 실행중인 프로그램은 없음" -> 왜냐면 도커 안에서 express를 실행중이니까
# "포트포워딩"을 통해 해결 : 도커에서 3000번 포트를 포워딩해줘서 내 컴퓨터가 도커 안에 있는 3000번으로 실행 중인 express를 찾게해준다(사진에서 시각화 보기)

# 내컴퓨터는 2500번포트 - 도커는 3000번 포트 이렇게 포워딩을 할 수도 있다
# sudo docker run -p 2500:3000 aa6a8b81584f[이미지ID]
# 이렇게 run을 하면 포트연결까지 보이게 실행된다 : 0.0.0.0:2500->3000/tcp, :::2500->3000/tcp



# 도커는 ctrl+c로 끌 수 없고, 새로 터미널을 켜고 docker stop [컨테이너 ID]을 해야된다


# 내 컴퓨터에서 소스코드를 수정했다면 docker build . 를 다시 해줘야된다

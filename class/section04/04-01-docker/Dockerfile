# 도커 설치 후 윈도우 WSL 관련 통합 설정하는건 아래의 링크에서 보기
# https://www.lainyzine.com/ko/article/a-complete-guide-to-how-to-install-docker-desktop-on-windows-10/


# 도커는 컴퓨터들이 모여있는 홈페이지에서 컴퓨터를 다운로드 받아올 수 있음
# 그 홈페이지가 '도커 허브', 여기서 운영체제를 받아옴
# FROM ubuntu:22.04
# # 도커로 설치한 우분투 컴퓨터에 node.js와 yarn설치
# RUN sudo apt install nodejs
# RUN sudo npm install -g yarn
# 위의 명령어처럼 하나하나 입력하면 너무 번거로우니까 아래 방식처럼 이미 리눅스 node npm yarn까지 모두 깔려있는 컴퓨터를 다운로드하는 방식을 쓴다

# node라는 도커 이미지를 다운로드 받는거임 (nodejs랑 다른거임!)
# 1. 운영체제 설치(node 14버전과 npm과 yarn이 모두 설치되어있는 리눅스)
FROM node:14

# 2. 내 컴퓨터에 있는 폴더나 파일을 도커 컴퓨터 안으로 복사하기
# myfolder를 만들고
# RUN mkdir myfolder
# # 현재 위치에 있는 index.js를 도커 컴퓨터 내의 myfolder안에 복사 
# COPY ./index.js /myfolder/index.js
# 내 컴퓨터 안에 있는 index.js를 도커 컴퓨터 안에있는 index.js로 복사하기
COPY ./index.js /index.js

# 3. 도커안에서 아까 복사한 index.js 실행시키기
CMD node index.js


# 내가 만든 도커 컴퓨터를 저장 및 최적화를 하는 과정을 docker build라고 한다 -> 이후 하나의 파일로 저장되는데 '도커 이미지'라고 부른다

# CMD와 RUN의 차이
# RUN명령어를 하면 도커 이미지를 만들때 RUN까지 실행을 해서 그걸 포함한 파일을 저장한다
# CMD는 도커 이미지 만들때 제외된다
# CMD는 저장된 컴퓨터를 '실행'시킬때 사용한다. 실행을 안 시켜놓고 저장한다음에, 실행을 할때 CMD 명령어를 실행한다
# 보통 CMD 직전까지 저장을 해놓고, 해당 이미지를 실행할때 CMD명령어를 실행한다

# RUN은 여러번 쓸 수 있지만, CMD는 한번밖에 못쓴다



# [실행순서] sudo를 꼭 붙여서 관리자 권한으로 실행하기
# 1. sudo docker build . 
# 도커를 빌드한다 -> 노드14를 다운받고, index.js를 복사함 -> 새로 만들어진 도커 컴퓨터가 만들어짐 => 이미지를 만든다

# 2. 이미지 실행 - 세팅은 다 끝났으니까 바로 실행될거고 CMD명령어도 같이 실행됨
# 도커 컴퓨터 안에 index.js파일이 있고 CMD를 통해 node index.js라는 명령어가 실행됨 -> 그럼 콘솔로그가 실행될거임(내 컴퓨터에서 터미널 명령어 실행하는거랑 똑같음)
# 3. 원래 도커는 할일 없으면 자동 종료되는데 우리가 while문을 걸어놨으니까 종료안됨

# sudo docker 
# 만든 도커 이미지 확인하기

# sudo docker run 97c11aeb10e8
#  맨 오른쪽은 image ID를 찾아서 넣으면되고, 이걸 실행하면 도커 컴퓨터가 실행됨

# sudo docker exec -it 5a65bb52fd06 /bin/bash
# 컨테이너에 접속하고 명령어 입력기가 켜짐
# -it 뒤에 아이디는 status라고 써있는 컨테이너 ID를 가져오면 됨
# bin/bash는 터미널 명령줄을 켜달라는 의미
#  도커 컴퓨터 안에 들어가면 root@5a65bb52fd06:/# 같은 명령줄이 켜지는데 그게 들어갔다는 의미
# 내가 만든 도커 컴퓨터랑 내 로컬 컴퓨터는 완전히 별개이다!

# 종료하는법
# root@5a65bb52fd06:/# 이렇게 생긴 쉘에서 exit으로 일단 나가기
# docker stop [컨테이너 아이디]
# 종료될때 시간이 좀 걸림, 이게 꺼지면 "이 파일은 도커 안에서 실행됩니다" 라는 콘솔도 꺼짐


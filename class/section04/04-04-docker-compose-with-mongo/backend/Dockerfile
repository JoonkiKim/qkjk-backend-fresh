# express도커 컴퓨터와 mongoDB도커 컴퓨터를 다 실행해보자

# 이 도커파일은 express도커이니까 mongoDB를 위한 도커를 만들어보자


FROM node:14
COPY ./package.json /myfolder/
COPY ./yarn.lock /myfolder/
WORKDIR /myfolder/
RUN yarn install
COPY . /myfolder/

CMD yarn start:dev



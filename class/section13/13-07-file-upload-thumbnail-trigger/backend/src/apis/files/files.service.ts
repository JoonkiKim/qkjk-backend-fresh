// promise all 로 이미지를 한번에 받아오고 한번에 전송해보자

import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';

import { FileUpload } from 'graphql-upload';
import { getToday } from 'src/commons/libraries/utils';

import { v4 as uuidv4 } from 'uuid';

export interface IFilesServiceUpload {
  files: FileUpload[];
}

@Injectable()
export class FilesService {
  async upload({ files }: IFilesServiceUpload): Promise<string[]> {
    console.log(files); // 얘는 Promise를 하나만 기다려서 첫번쨰 이미지만 잘 받아오고 두번쨰는 pending이다

    const waitedFiles = await Promise.all(files);
    console.log(waitedFiles); // [File, File] // 얘는 Promise를 다 기다려서 둘다 값을 잘 받아온다

    // 1. 파일을 클라우드 스토리지에 저장하는 로직
    // 1-1) 스토리지 세팅하기
    // 이미지 주소의 앞부분은 클라우드스토리지의 버킷 이름으로 붙으니까 그걸 넣어주기
    const bucket = 'qkjk-backend-practice';

    const storage = new Storage({
      projectId: 'qkjk-backend',

      keyFilename: 'qkjk-backend-5d4deafe907d.json',
    }).bucket('qkjk-backend-practice');

    // 1-2) 스토리지에 파일 올리기
    // Promise.all사용하기 -> waitedFiles자체가 배열이니까 따로 []를 적어주지 않는다
    // map으로 waitedFiles을 뿌려서 Promise.all로 한번에 전송해준다

    const results = await Promise.all(
      waitedFiles.map(
        (el) =>
          new Promise<string>((resolve, reject) => {
            // new Promise<string>를 써주면 Promise안에서 resolve되는 값은 string이라는 것을 선언해줄 수 있음 -> `${bucket}/${el.filename}` 이 부분이 string이라고 선언해준거임

            // 파일 이름에 날짜와 아이디를 부여해보자 => 썸네일 스토리지 안에서 연 월 일 별로 폴더가 생성되어서 날짜별로 볼수있다
            const filename = `${getToday()}/${uuidv4()}/origin/${el.filename}`;

            el.createReadStream()
              .pipe(storage.file(filename).createWriteStream())
              .on('finish', () => resolve(`${bucket}/${filename}`))
              .on('error', () => reject('실패'));
          }),
      ),
    );
    // 2. 다운로드URL 브라우저에 돌려주기
    return results;
  }
}

// files.service.ts

import { Injectable } from '@nestjs/common';
import { IFilesServiceUpload } from './interfaces/files-service.interface';
import { Storage } from '@google-cloud/storage';

@Injectable()
export class FilesService {
  async upload({ file }: IFilesServiceUpload): Promise<string> {
    console.log(file);

    // 1. 파일을 클라우드 스토리지에 저장하는 로직

    // 1-1) 스토리지 셋팅하기
    const storage = new Storage({
      projectId: 'qkjk-backend',

      keyFilename: 'qkjk-backend-5d4deafe907d.json',
    }).bucket('qkjk-backend-practice');

    // 1-2) 스토리지에 파일 올리기
    // 스토리지에 파일을 올리는 함수 부분에 await new Promise<string>를 적용해줘서 이 함수가 끝나기 전까지는 밑으로 안 내려간다
    // resolve는 성공, reject는 실패일때 사용하는거다
    await new Promise<string>((resolve, reject) =>
      file
        .createReadStream()
        .pipe(storage.file(file.filename).createWriteStream())
        .on('finish', () => {
          console.log('성공');
          resolve('끝');
        })
        .on('error', () => {
          console.log('실패');
          reject('실패');
        }),
    );
    console.log('파일전송이 완료되었습니다.');

    return '임시작성';
  }
}

// 이렇게 Promise를 사용해주면 성공 -> 파일전송이 완료되었습니다. 순서로 실행순서가 제어된다!

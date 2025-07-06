import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';

import { FileUpload } from 'graphql-upload';

export interface IFilesServiceUpload {
  file: FileUpload;
}

@Injectable()
export class FilesService {
  upload({ file }: IFilesServiceUpload): string {
    console.log(file);

    // 1. 파일을 클라우드 스토리지에 저장하는 로직

    // 1-1) 스토리지 세팅하기
    const storage = new Storage({
      projectId: 'qkjk-backend',
      //프로젝트 id는 image.png에 있는 화면의 ID부분을 가져온거임
      keyFilename: 'qkjk-backend-5d4deafe907d.json',
      // 이건 JSON으로 받아온 권한 파일 이름 넣어주면 됨
    }).bucket('qkjk-backend-practice');
    // GCP에서 버킷만든다음에 그 이름을 bucket안에 넣어주면 됨

    // 1-2) 스토리지에 파일 올리기
    // 브라우저에서 file을 받아오면 createReadStream로 파일을 읽어들인다음에 pipe에 넘겨주고, 그 파일 이름은 file.filename으로해서 뽑아온다음에 createWriteStream를 통해 클라우드에 올려주는거다
    file
      .createReadStream()
      .pipe(storage.file(file.filename).createWriteStream())
      .on('finish', () => {
        console.log('성공');
      })
      .on('error', () => {
        console.log('실패');
      });

    console.log('파일전송이 완료되었습니다');

    return '끝'; // 일단 임시로 끝이라고 해두자
    // 2. 다운로드URL 브라우저에 돌려주기
    //
  }
}

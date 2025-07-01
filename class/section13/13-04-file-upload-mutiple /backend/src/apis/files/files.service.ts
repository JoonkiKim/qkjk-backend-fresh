// 브라우저로부터 여러개의 이미지를 받아와서 저장하고 여러개의 이미지 주소를 리턴해줘보자
// 일단 여러 이미지를 하나씩 각각 받아오는 로직부터 파악해보자

import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';

import { FileUpload } from 'graphql-upload';

export interface IFilesServiceUpload {
  files: FileUpload[];
}

@Injectable()
export class FilesService {
  async upload({ files }: IFilesServiceUpload): Promise<string[]> {
    console.log(files);
    // 이미지를 두개 '받아올때'도 각각 하나씩 기다려줘야된다
    const waitedFiles = [];
    waitedFiles[0] = await files[0];
    waitedFiles[1] = await files[1];

    console.log(waitedFiles); // [File, File]

    // 1. 파일을 클라우드 스토리지에 저장하는 로직
    // 1-1) 스토리지 세팅하기
    const storage = new Storage({
      projectId: 'qkjk-backend',

      keyFilename: 'qkjk-backend-5d4deafe907d.json',
    }).bucket('qkjk-backend-practice');

    // 1-2) 스토리지에 파일 올리기
    // 일단 아래의 방식으로 하나씩 업로드한다고 해보자
    // for문을 쓰건 안쓰건 '하나씩' 업로드 되는건 변함이 없다
    // 한번에 업로드하는게 아니라 리얼 한 파일씩 성실하게 업로드하는거임
    // 따라서 for문으로 await로 하나씩 업로드 하면 안됨!
    // 이런걸 '안티패턴'이라고 부름

    console.time('시간을 확인해보자!!');
    const results = [];
    for (let i = 0; i < waitedFiles.length; i++) {
      results[i] = await new Promise((resolve, reject) =>
        waitedFiles[i]
          .createReadStream()
          .pipe(storage.file(waitedFiles[i].filename).createWriteStream())
          .on('finish', () => resolve('성공'))
          .on('error', () => reject('실패')),
      );
    }
    console.timeEnd('시간을 확인해보자!!');

    // files
    //   .createReadStream()
    //   .pipe(storage.file(files.filename).createWriteStream())
    //   .on('finish', () => {
    //     console.log('성공');
    //   })
    //   .on('error', () => {
    //     console.log('실패');
    //   });

    // console.log('파일전송이 완료되었습니다');

    return ['끝', '끝2'];
    // 2. 다운로드URL 브라우저에 돌려주기
    //
  }
}

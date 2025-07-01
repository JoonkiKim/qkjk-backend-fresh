// promise all 로 이미지를 한번에 받아오고 한번에 전송해보자

import { Storage } from '@google-cloud/storage';
import { Injectable } from '@nestjs/common';

import { getToday } from 'src/commons/libraries/utils';
import { v4 as uuidv4 } from 'uuid';
import {
  IProductImagesServiceSaveImages,
  IProductImagesServiceUpdateImages,
  IProductImagesServiceUpload,
} from './interfaces/productImages-service.interface';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductImage } from './entities/productImage.entity';
import { Repository } from 'typeorm';

@Injectable()
export class ProductImagesService {
  constructor(
    @InjectRepository(ProductImage)
    private readonly productImagesRepository: Repository<ProductImage>,
  ) {}

  async saveImages({
    inputs,
    product,
  }: IProductImagesServiceSaveImages): Promise<ProductImage[]> {
    const entities = inputs.map((dto, idx) =>
      this.productImagesRepository.create({
        url: dto.url,
        isMain: dto.isMain ?? idx === 0,
        product,
      }),
    );
    return await this.productImagesRepository.save(entities);
  }

  async updateImages({
    inputs,
    product,
  }: IProductImagesServiceUpdateImages): Promise<ProductImage[]> {
    // 1) 기존 이미지 삭제
    await this.productImagesRepository.delete({ product: { id: product.id } });

    // 2) 새 이미지 생성
    const entities = inputs.map((dto, idx) =>
      this.productImagesRepository.create({
        url: dto.url,
        isMain: dto.isMain ?? idx === 0,
        product,
      }),
    );

    return await this.productImagesRepository.save(entities);
  }

  async upload({
    productImages,
  }: IProductImagesServiceUpload): Promise<string[]> {
    const waitedFiles = await Promise.all(productImages);
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
            console.log('여기까진 왔따');
            // new Promise<string>를 써주면 Promise안에서 resolve되는 값은 string이라는 것을 선언해줄 수 있음 -> `${bucket}/${el.filename}` 이 부분이 string이라고 선언해준거임
            const filename = `${getToday()}/${uuidv4()}/origin/${el.filename}`;

            el.createReadStream()
              .pipe(storage.file(filename).createWriteStream())
              .on('finish', () => resolve(`${bucket}/${filename}`))
              .on('error', (err) => {
                console.error('GCS 업로드 실패:', err); // ← 실제 원인 확인
                reject(err);
              });
          }),
      ),
    );
    // 2. 다운로드URL 브라우저에 돌려주기
    return results;
  }
}

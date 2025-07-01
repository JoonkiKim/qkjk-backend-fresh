import { Injectable, UnprocessableEntityException } from '@nestjs/common';

import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IProductServiceCheckSouldOut,
  IProductServiceUpdate,
  IProductsServiceCreate,
  IProductsServiceDelete,
  IProductsServiceFindOne,
} from './interfaces/products-service.interfaces';
import { ProductsDetailsService } from '../productsDetails/productsDetails.service';
import { AllergiesService } from '../allergies/allergies.service';
import { ProductImagesService } from '../productsImages/productImages.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,

    private readonly productsDetailsService: ProductsDetailsService, // 서비스를 가져올때는 Repository를 주입하는게 아니라 service를 주입해야된다..!!

    private readonly productImagesService: ProductImagesService,

    private readonly allergiesService: AllergiesService,
  ) {}

  findAll(): Promise<Product[]> {
    return this.productsRepository.find({
      relations: ['productDetail', 'productCategory', 'store', 'allergies'], // 여기에 조인하고 싶은 테이블 이름을 적어주면 조인해서 가져와진다
      // 왜 allergies만 s가 붙어있냐면, product테이블의 엔티티에서 N:M조인할때 알러지테이블에 대해 선언했던 allergies: Allergy[];에 따라서 s가 붙는거임 => 엔티티의 조인컬럼명 선언에 따라서 relation의 테이블명을 선언해주는거다. 이건 N:M이니까 s를 붙여주는게 맞고 (만약에 내맘대로 s를 빼고 allergy이렇게 넣었다면 relation에서도 allergy이렇게 써주면 된다. 다만 규칙에 어긋나니까 안하는거임임)
    });
  }
  findOne({ productId }: IProductsServiceFindOne): Promise<Product> {
    return this.productsRepository.findOne({
      where: { id: productId },
      relations: ['productDetail', 'productCategory', 'store', 'allergies'], // 여기도 조인하고 싶은 테이블 이름을 적어주면 조인해서 가져와진다
    });
  }

  findAllWithDeleted(): Promise<Product[]> {
    return this.productsRepository.find({
      withDeleted: true, // ✅ 삭제된 데이터 포함하여 조회
      // 서비스쪽에 withDeleted를 넣어주면 삭제된 데이터 포함하여 조회된다
    });
  }

  async create({
    createProductInput,
  }: IProductsServiceCreate): Promise<Product> {
    const {
      productDetail,
      productCategoryId,
      storeId,
      allergies,
      productImageUrls,
      ...product
    } = createProductInput;

    const result = await this.productsDetailsService.create({
      // 항상 여기 await를 넣어주자
      ...productDetail,
    });

    // allergies는 Allergy[]인데, allergyNames를 allergies.map(el => el.name)을 사용해 string[]으로 변환
    const allergyNames = allergies.map((el) => el.name);

    // 저위에서 쪼개준 allergies를 여기에 넣어주는거임
    const prevAllergies = await this.allergiesService.findByNames({
      allergyNames,
    });

    const temp = [];
    allergyNames.forEach((el) => {
      const exists = prevAllergies.find((prevEl) => el === prevEl.name);
      if (!exists) temp.push({ name: el });
    }); // 로직 설명 6

    const newAllergies = await this.allergiesService.bulkInsert({
      names: temp,
    }); // 로직 설명 7

    const insertAllergies = [...prevAllergies, ...newAllergies.identifiers];

    const result2 = await this.productsRepository.save({
      ...product,
      productDetail: result,

      productCategory: {
        id: productCategoryId,
      },

      store: {
        id: storeId,
      },

      allergies: insertAllergies,
    });

    // ✅ productImages 테이블에 URL 저장 (서비스 호출)
    //    ProductImagesService.saveImages(productImageUrls, result2) 시그니처:
    //      ① 첫 번째 인자 = URL 배열
    //      ② 두 번째 인자 = 방금 저장된 상품(result2) → FK 연결
    if (productImageUrls?.length) {
      await this.productImagesService.saveImages({
        inputs: productImageUrls,
        product: result2,
      });
    }

    return result2;
  }

  async update({
    productId,
    updateProductInput,
  }: IProductServiceUpdate): Promise<Product> {
    const product = await this.findOne({ productId });

    this.checkSoldOut({ product });

    const {
      productDetail,
      productCategoryId,
      storeId,
      allergies,
      productImageUrls,
      ...updateFields
    } = updateProductInput;

    // ✅ productDetail 업데이트 (서비스 호출)
    const updatedProductDetail = productDetail
      ? await this.productsDetailsService.update({
          productDetailId: product.productDetail.id,
          updateProductDetailInput: productDetail,
        })
      : product.productDetail;

    // ✅ allergies 업데이트 (서비스 호출)
    const updatedAllergies = allergies
      ? await this.allergiesService.updateAllergies(
          allergies.filter((el) => el.name), // ✅ null 값 방지, name만 뽑아내서 null이나 빈값을 제거한다
        )
      : product.allergies;

    // 3) save() 시점에 **스프레드**로 필드 병합
    const savedProduct = await this.productsRepository.save({
      ...product, // 기존 상품 엔티티
      ...updateFields, // 수정할 일반 필드(name, price 등)
      productDetail: updatedProductDetail,
      productCategory: productCategoryId
        ? { id: productCategoryId }
        : product.productCategory,
      store: storeId ? { id: storeId } : product.store,
      allergies: updatedAllergies,
    });

    // 4) 이미지 전부 삭제 → 재생성 로직
    if (productImageUrls) {
      await this.productImagesService.updateImages({
        inputs: productImageUrls,
        product: savedProduct,
      });
    }

    return savedProduct;
  }

  checkSoldOut({ product }: IProductServiceCheckSouldOut) {
    if (product.isSoldout) {
      throw new UnprocessableEntityException('이미 판매완료된 상품입니다');
    }
  }

  async delete({ productId }: IProductsServiceDelete): Promise<boolean> {
    const result = await this.productsRepository.softDelete({ id: productId });

    return result.affected ? true : false;
  }

  async restore({ productId }: IProductsServiceDelete): Promise<boolean> {
    const result = await this.productsRepository.restore({ id: productId });
    // 서비스쪽에 restore를 넣어주면 softdeleted된 데이터를 복구할 수 있다
    return result.affected ? true : false;
  }
}

import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

import { Repository } from 'typeorm';
import { Product } from './entities/product.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {
  IPoroductsServiceCreate,
  IProductServiceCheckSouldOut,
  IProductServiceUpdate,
  IProductsServiceDelete,
  IProductsServiceFindOne,
} from './interfaces/products-service.interfaces';
import { ProductSaleslocationsService } from '../productsSaleslocations/productsSaleslocations.service';

@Injectable()
export class ProductsService {
  constructor(
    @InjectRepository(Product)
    private readonly productsRepository: Repository<Product>,
    private readonly productsSaleslocationsService: ProductSaleslocationsService,
  ) {}

  findAll(): Promise<Product[]> {
    return this.productsRepository.find({
      // 같이 조회하는건 productCategory를 relation부분에 써주기만 하면 된다
      relations: ['productSaleslocation', 'productCategory'],
    });
  }
  findOne({ productId }: IProductsServiceFindOne): Promise<Product> {
    return this.productsRepository.findOne({
      where: { id: productId },
      relations: ['productSaleslocation', 'productCategory'],
    });
  }

  async create({
    createProductInput,
  }: // 여기서 별다른 작업을 안해줘도, dto를 통해 카테고리id가 들어온 상태이니까 이렇게만 둬도 카테고리 id가 연결되어있는거다

  IPoroductsServiceCreate): Promise<Product> {
    // dto를 통해 카테고리id가 들어온 상태이므로 카테고리 id를 떼어낸다
    const { productSaleslocation, productCategoryId, ...product } =
      createProductInput;

    // 앞서 언급한 것처럼 상품 거래위치정보는 이렇게 create로 거래위치 테이블에 따로 저장해주지만, productCategoryId는 카테고리 테이블에 따로 '저장'하지 않는다
    const result = await this.productsSaleslocationsService.create({
      productSaleslocation,
    });

    const result2 = this.productsRepository.save({
      ...product,
      productSaleslocation: result,

      // 카테고리 테이블에는 id를 저장하지 않고, createProduct로 DB에 저장할때 '상품'테이블에 id를 저장해준다
      productCategory: {
        id: productCategoryId,
        // 근데 이렇게만 하면, 등록 이후 등록결과를 받아올때 name을 받아올 수가 없다. 그럼 같이 받고 싶으면 어떻게 해야되냐면
        // createProduct의 dto에서 productCategoryId만 연결하는게 아니라 name까지 포함해서 productCategory를 싹 다 넣어주면 된다
      },
    });

    return result2;
  }

  async update({
    productId,
    updateProductInput,
  }: IProductServiceUpdate): Promise<Product> {
    const product = await this.findOne({ productId });

    this.checkSoldOut({ product });

    const result = this.productsRepository.save({
      ...product,
      ...updateProductInput,
    });

    return result;
  }

  checkSoldOut({ product }: IProductServiceCheckSouldOut) {
    if (product.isSoldout) {
      throw new HttpException(
        '이미 판매완료된 상품입니다',
        HttpStatus.UNPROCESSABLE_ENTITY,
      );
    }
  }

  async delete({ productId }: IProductsServiceDelete): Promise<boolean> {
    const result = await this.productsRepository.softDelete({ id: productId });

    return result.affected ? true : false;
  }
}

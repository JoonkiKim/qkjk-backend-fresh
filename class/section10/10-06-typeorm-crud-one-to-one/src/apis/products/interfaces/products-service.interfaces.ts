import { CreateProductInput } from '../dto/create-product.input';
import { UpdateProductInput } from '../dto/update-product.input';
import { Product } from '../entities/product.entity';

export interface IPoroductsServiceCreate {
  createProductInput: CreateProductInput;
}

export interface IProductsServiceFindOne {
  productId: string;
}

export interface IProductServiceUpdate {
  productId: string;
  updateProductInput: UpdateProductInput;
}

export interface IProductServiceCheckSouldOut {
  product: Product;
}

export interface IProductsServiceDelete {
  productId: string;
}

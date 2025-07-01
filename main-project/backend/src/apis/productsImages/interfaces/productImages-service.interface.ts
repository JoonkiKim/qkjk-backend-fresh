import { FileUpload } from 'graphql-upload';
import { ProductImageInput } from '../dto/create-productImage.input';
import { Product } from 'src/apis/products/entities/product.entity';

export interface IProductImagesServiceUpload {
  productImages: FileUpload[];
}

export interface IProductImagesServiceSaveImages {
  inputs: ProductImageInput[];
  product: Product;
}

export interface IProductImagesServiceUpdateImages {
  product: Product;
  inputs: ProductImageInput[];
}

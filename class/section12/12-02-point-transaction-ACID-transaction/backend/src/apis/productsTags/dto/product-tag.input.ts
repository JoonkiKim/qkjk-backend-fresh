// src/apis/productsTags/dto/product-tag.input.ts
import { InputType, OmitType } from '@nestjs/graphql';
import { ProductTag } from '../entities/productTag.entity';

@InputType()
export class ProductTagInput extends OmitType(
  ProductTag,
  ['id', 'products'], // ← 여기서 products까지 제외
  InputType,
) {}

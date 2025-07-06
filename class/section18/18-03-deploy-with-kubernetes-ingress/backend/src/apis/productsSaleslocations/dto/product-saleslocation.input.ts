import { InputType, OmitType } from '@nestjs/graphql';
import { ProductSaleslocation } from '../entities/productSaleslocation.entity';

// ProductSaleslocation관련 dto를 만들건데 ProductSaleslocation 엔티티를 상속받아서 그대로 가져오되, id컬럼은 빼고 타입을 InputType으로 바꿔줘 라는 뜻

@InputType() // 이 dto에 또 뭔가를 추가할 수도 있으니까 InputType을 또 적어준다
export class ProductSaleslocationInput extends OmitType(
  ProductSaleslocation,
  ['id'],
  InputType,
  // ProductSaleslocation관련 dto를 만들건데 ProductSaleslocation 엔티티를 그대로 가져오되, id컬럼은 빼고 타입을 InputType으로 바꿔줘 라는 뜻
) {}

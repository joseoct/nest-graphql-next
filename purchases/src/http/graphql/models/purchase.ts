import { Field, ID, ObjectType, registerEnumType } from '@nestjs/graphql';
import { Product } from './product';

enum ProductStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  FAILED = 'FAILED',
}

registerEnumType(ProductStatus, {
  name: 'ProductStatus',
  description: 'The status of a purchase',
});

@ObjectType()
export class Purchase {
  @Field(() => ID)
  id: string;

  @Field(() => ProductStatus)
  status: ProductStatus;

  @Field(() => Product)
  product: Product;
  productId: string;

  @Field(() => Date)
  createdAt: Date;
}

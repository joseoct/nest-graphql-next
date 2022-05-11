import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductService } from '../../../services/product.service';
import { CreateProductInput } from '../inputs/create-product-input';
import { Product } from '../models/product';

@Resolver(() => Product)
export class ProductsResolver {
  constructor(private productService: ProductService) {}

  @Query(() => [Product])
  products() {
    return this.productService.listAllProducts();
  }

  // @UseGuards(AuthorizationGuard)
  @Mutation(() => Product)
  createProduct(@Args('data') data: CreateProductInput) {
    return this.productService.createProduct(data);
  }
}

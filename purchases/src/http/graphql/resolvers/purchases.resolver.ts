import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { ProductService } from '../../../services/product.service';
import { PurchaseService } from '../../../services/purchase.service';
import { Purchase } from '../models/purchase';

@Resolver(() => Purchase)
export class PurchaseResolver {
  constructor(
    private purchasesService: PurchaseService,
    private productsService: ProductService,
  ) {}

  // @UseGuards(AuthorizationGuard)
  @Query(() => [Purchase])
  purchases() {
    return this.purchasesService.listAllPurchases();
  }

  @ResolveField(() => Purchase)
  product(@Parent() purchase: Purchase) {
    return this.productsService.getProductById(purchase.productId);
  }
}

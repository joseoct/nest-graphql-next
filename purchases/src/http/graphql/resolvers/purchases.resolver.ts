import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { CustomerService } from '../../../services/customer.service';
import { ProductService } from '../../../services/product.service';
import { PurchaseService } from '../../../services/purchase.service';
import { AuthorizationGuard } from '../../auth/authorization.guard';
import { AuthUser, GetUser } from '../../auth/current-user';
import { CreatePurchaseInput } from '../inputs/create-purchase-input';
import { Purchase } from '../models/purchase';

@Resolver(() => Purchase)
export class PurchaseResolver {
  constructor(
    private purchasesService: PurchaseService,
    private productsService: ProductService,
    private customersService: CustomerService,
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

  @Mutation(() => Purchase)
  @UseGuards(AuthorizationGuard)
  async createPurchase(
    @Args('data') data: CreatePurchaseInput,
    @GetUser() user: AuthUser,
  ) {
    const customer = await this.customersService.createCustomer({
      authUserId: user.sub,
    });

    return this.purchasesService.createPurchase({
      customerId: customer.id,
      productId: data.productId,
    });
  }
}

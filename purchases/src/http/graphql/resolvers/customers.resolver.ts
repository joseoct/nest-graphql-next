import { UseGuards } from '@nestjs/common';
import { Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { CustomerService } from '../../../services/customer.service';
import { PurchaseService } from '../../../services/purchase.service';
import { AuthorizationGuard } from '../../auth/authorization.guard';
import { GetUser, AuthUser } from '../../auth/current-user';
import { Customer } from '../models/customer';

@Resolver(() => Customer)
export class CustomerResolver {
  constructor(
    private customerService: CustomerService,
    private purchasesService: PurchaseService,
  ) {}

  @Query(() => Customer)
  @UseGuards(AuthorizationGuard)
  me(@GetUser() user: AuthUser) {
    return this.customerService.getCustomerByAuthUserId(user.sub);
  }

  @ResolveField()
  purchases(@Parent() me: Customer) {
    return this.purchasesService.listAllByCustomerId(me.id);
  }
}

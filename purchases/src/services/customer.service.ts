import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';

interface CreateCustomerParams {
  authUserId: string;
}

@Injectable()
export class CustomerService {
  constructor(private prisma: PrismaService) {}

  getCustomerByAuthUserId(authUserId: string) {
    return this.prisma.customer.findUnique({
      where: {
        authUserId,
      },
    });
  }

  async createCustomer({ authUserId }: CreateCustomerParams) {
    const customerExists = await this.getCustomerByAuthUserId(authUserId);

    if (!customerExists) {
      return this.prisma.customer.create({
        data: {
          authUserId,
        },
      });
    }

    return customerExists;
  }
}

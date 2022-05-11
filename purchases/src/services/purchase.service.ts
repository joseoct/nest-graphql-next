import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';

interface CreatePurchaseParams {
  productId: string;
  customerId: string;
}

@Injectable()
export class PurchaseService {
  constructor(private prisma: PrismaService) {}

  listAllPurchases() {
    return this.prisma.purchase.findMany({
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  listAllByCustomerId(customerId: string) {
    return this.prisma.purchase.findMany({
      where: {
        customerId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });
  }

  createPurchase(data: CreatePurchaseParams) {
    const productExists = this.prisma.product.findUnique({
      where: {
        id: data.productId,
      },
    });

    if (!productExists) {
      throw new Error('Product does not exist');
    }

    return this.prisma.purchase.create({
      data,
    });
  }
}

import { Injectable } from '@nestjs/common';
import { PrismaService } from '../database/prisma/prisma.service';
import { KafkaService } from '../messaging/kafka.service';

interface CreatePurchaseParams {
  productId: string;
  customerId: string;
}

@Injectable()
export class PurchaseService {
  constructor(private prisma: PrismaService, private kafka: KafkaService) {}

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

  async createPurchase(data: CreatePurchaseParams) {
    const productExists = await this.prisma.product.findUnique({
      where: {
        id: data.productId,
      },
    });

    if (!productExists) {
      throw new Error('Product does not exist');
    }

    const purchase = this.prisma.purchase.create({
      data,
    });

    const customer = await this.prisma.customer.findUnique({
      where: {
        id: data.customerId,
      },
    });

    this.kafka.emit('purchases.new-purchase', {
      customer: {
        authUserId: customer.authUserId,
      },
      product: {
        id: data.productId,
        title: productExists.title,
        slug: productExists.slug,
      },
    });

    return purchase;
  }
}

import { BadRequestException, Injectable, Logger, NotFoundException, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { PaginationDto } from 'src/common';

@Injectable()
export class ProductsService extends PrismaClient implements OnModuleInit {
  private readonly logger = new Logger('ProductService');

  onModuleInit() {
    this.$connect();
    this.logger.log('Database Connected');
  }

  async create(createProductDto: CreateProductDto) {
    const product = await this.product.create({
      data: createProductDto,
    });
    return product;
  }

  async findAll(paginationDto: PaginationDto) {
    const { page, limit } = paginationDto;
    const totalRegs = await this.product.count({
      where: { available: true },
    });
    const totalPages = Math.ceil(totalRegs / limit);
    const products = await this.product.findMany({
      skip: (page - 1) * limit,
      take: limit,
      where: { available: true },
    });
    if (!products) {
      throw new BadRequestException('No registers on DataBase');
    }
    return {
      products,
      meta: {
        page,
        totalRegs,
        totalPages,
      },
    };
  }

  async findOne(id: number) {
    const product = await this.product.findFirst({
      where: {
        id,
        available: true,
      },
    });
    if (!product) {
      throw new NotFoundException('Product Not Found');
    }
    return product;
  }

  async update(id: number, updateProductDto: UpdateProductDto) {
    const { id: __, ...data } = updateProductDto;

    await this.findOne(id);
    const productUpdated = await this.product.update({
      where: { id },
      data: data,
    });
    return productUpdated;
  }

  async remove(id: number) {
    await this.findOne(id);
    /* await this.product.delete({
      where: {
        id,
      },
    }); */
    const productToDelete = await this.product.update({
      where: { id },
      data: { available: false },
    });
    return { product: productToDelete };
  }
}

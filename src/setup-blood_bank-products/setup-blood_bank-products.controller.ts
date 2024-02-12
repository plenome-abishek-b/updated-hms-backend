import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SetupBloodBankProductsService } from './setup-blood_bank-products.service';
import { SetupBloodBankProduct } from './entities/setup-blood_bank-product.entity';

@Controller('setup-blood-bank-products')
export class SetupBloodBankProductsController {
  constructor(private readonly setupBloodBankProductsService: SetupBloodBankProductsService) {}

  @Post()
  create(@Body() bloodproductsEntity: SetupBloodBankProduct ) {
    return this.setupBloodBankProductsService.create(bloodproductsEntity);
  }

  @Get()
  findAll() {
    return this.setupBloodBankProductsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.setupBloodBankProductsService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() bloodproductsEntity: SetupBloodBankProduct ) {
    return this.setupBloodBankProductsService.update(id,bloodproductsEntity );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.setupBloodBankProductsService.remove(id);
  }
}

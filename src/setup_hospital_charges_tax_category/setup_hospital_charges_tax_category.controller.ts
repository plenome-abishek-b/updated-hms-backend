import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import {  tax_categoryservice } from './setup_hospital_charges_tax_category.service';
import { SetupHospitalChargesTaxCategory } from './entities/setup_hospital_charges_tax_category.entity';

@Controller('setup-hospital-charges-tax-category')
export class SetupHospitalChargesTaxCategoryController {
  constructor(private readonly setupHospitalChargesTaxCategoryService: tax_categoryservice) {}

  @Post()
  create(@Body() tax_categoryEntity: SetupHospitalChargesTaxCategory ) {
    return this.setupHospitalChargesTaxCategoryService.create(tax_categoryEntity);
  }

  @Get()
  findAll() {
    return this.setupHospitalChargesTaxCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.setupHospitalChargesTaxCategoryService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() tax_categoryEntity: SetupHospitalChargesTaxCategory) {
    return this.setupHospitalChargesTaxCategoryService.update(+id,tax_categoryEntity );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.setupHospitalChargesTaxCategoryService.remove(id);
  }
}

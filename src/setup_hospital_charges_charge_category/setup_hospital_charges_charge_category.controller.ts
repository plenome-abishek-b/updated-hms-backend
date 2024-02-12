import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SetupHospitalChargesChargeCategoryService } from './setup_hospital_charges_charge_category.service';
import { SetupHospitalChargesChargeCategory } from './entities/setup_hospital_charges_charge_category.entity';

@Controller('setup-hospital-charges-charge-category')
export class SetupHospitalChargesChargeCategoryController {
  constructor(private readonly setupHospitalChargesChargeCategoryService: SetupHospitalChargesChargeCategoryService) {}

  @Post()
  create(@Body() charge_categoryEntity: SetupHospitalChargesChargeCategory ) {
    return this.setupHospitalChargesChargeCategoryService.create(charge_categoryEntity);
  }

  @Get()
  findAll() {
    return this.setupHospitalChargesChargeCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.setupHospitalChargesChargeCategoryService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() charge_categoryEntity: SetupHospitalChargesChargeCategory) {
    return this.setupHospitalChargesChargeCategoryService.update(id,charge_categoryEntity);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.setupHospitalChargesChargeCategoryService.remove(id);
  }
}

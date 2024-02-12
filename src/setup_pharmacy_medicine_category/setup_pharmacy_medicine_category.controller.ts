import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { MedicineCategoryService } from './setup_pharmacy_medicine_category.service';
import { SetupPharmacyMedicineCategory } from './entities/setup_pharmacy_medicine_category.entity';

@Controller('setup_pharmacy_medicine_category')
export class MedicineCategoryController {
  constructor(private readonly medicineCategoryService: MedicineCategoryService) {}

  @Post()
  create(@Body() medicine_categoryEntity: SetupPharmacyMedicineCategory) {
    return this.medicineCategoryService.create(medicine_categoryEntity);
  }

  @Get()
  findAll() {
    return this.medicineCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.medicineCategoryService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() medicine_categoryEntity: SetupPharmacyMedicineCategory) {
    return this.medicineCategoryService.update(id, medicine_categoryEntity);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.medicineCategoryService.remove(id);
  }
}
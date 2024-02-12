import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SetupPharmacyMedicineDosageService } from './setup_pharmacy_medicine_dosage.service';
import { SetupPharmacyMedicineDosage } from './entities/setup_pharmacy_medicine_dosage.entity';


@Controller('setup-pharmacy-medicine-dosage')
export class SetupPharmacyMedicineDosageController {
  constructor(private readonly setupPharmacyMedicineDosageService: SetupPharmacyMedicineDosageService) {}

  @Post()
  create(@Body() Medicine_dosageEntity: SetupPharmacyMedicineDosage ) {
    return this.setupPharmacyMedicineDosageService.create(Medicine_dosageEntity);
  }

  @Get()
  findAll() {
    return this.setupPharmacyMedicineDosageService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.setupPharmacyMedicineDosageService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() Medicine_dosageEntity: SetupPharmacyMedicineDosage  ) {
    return this.setupPharmacyMedicineDosageService.update(id,Medicine_dosageEntity );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.setupPharmacyMedicineDosageService.remove(id);
  }
}

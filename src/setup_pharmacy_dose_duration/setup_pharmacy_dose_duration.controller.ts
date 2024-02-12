import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SetupPharmacyDoseDurationService } from './setup_pharmacy_dose_duration.service';
import { SetupPharmacyDoseDuration } from './entities/setup_pharmacy_dose_duration.entity';

@Controller('setup-pharmacy-dose-duration')
export class SetupPharmacyDoseDurationController {
  constructor(private readonly setupPharmacyDoseDurationService: SetupPharmacyDoseDurationService) {}

  @Post()
  create(@Body() dosedurationEntity: SetupPharmacyDoseDuration) {
    return this.setupPharmacyDoseDurationService.create(dosedurationEntity);
  }

  @Get()
  findAll() {
    return this.setupPharmacyDoseDurationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.setupPharmacyDoseDurationService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body()dosedurationEntity: SetupPharmacyDoseDuration)  {
    return this.setupPharmacyDoseDurationService.update(id,dosedurationEntity);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.setupPharmacyDoseDurationService.remove(id);
  }
}

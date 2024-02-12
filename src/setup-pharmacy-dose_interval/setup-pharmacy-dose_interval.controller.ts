import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SetupPharmacyDoseIntervalService } from './setup-pharmacy-dose_interval.service';
import { SetupPharmacyDoseInterval } from './entities/setup-pharmacy-dose_interval.entity';

@Controller('setup-pharmacy-dose-interval')
export class SetupPharmacyDoseIntervalController {
  constructor(private readonly setupPharmacyDoseIntervalService: SetupPharmacyDoseIntervalService) {}

  @Post()
  create(@Body() dose_intervalEntity: SetupPharmacyDoseInterval) {
    return this.setupPharmacyDoseIntervalService.create(dose_intervalEntity);
  }

  @Get()
  findAll() {
    return this.setupPharmacyDoseIntervalService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.setupPharmacyDoseIntervalService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() dose_intervalEntity: SetupPharmacyDoseInterval) {
    return this.setupPharmacyDoseIntervalService.update(id, dose_intervalEntity);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.setupPharmacyDoseIntervalService.remove(id);
  }
}

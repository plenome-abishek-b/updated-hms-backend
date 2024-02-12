import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SetupHospitalChargesChargeTypeMasterService } from './setup-hospital-charges_charge_type_master.service';
import { SetupHospitalChargesChargeTypeMaster } from './entities/setup-hospital-charges_charge_type_master.entity';

@Controller('setup-hospital-charges-charge-type-master')
export class SetupHospitalChargesChargeTypeMasterController {
  constructor(private readonly setupHospitalChargesChargeTypeMasterService: SetupHospitalChargesChargeTypeMasterService) {}

  @Post()
  create(@Body()  charge_type_masterEntity: SetupHospitalChargesChargeTypeMaster) {
    return this.setupHospitalChargesChargeTypeMasterService.create(charge_type_masterEntity);
  }

  @Get()
  findAll() {
    return this.setupHospitalChargesChargeTypeMasterService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.setupHospitalChargesChargeTypeMasterService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body()charge_type_masterEntity: SetupHospitalChargesChargeTypeMaster ) {
    return this.setupHospitalChargesChargeTypeMasterService.update(id,charge_type_masterEntity );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.setupHospitalChargesChargeTypeMasterService.remove(id);
  }
}

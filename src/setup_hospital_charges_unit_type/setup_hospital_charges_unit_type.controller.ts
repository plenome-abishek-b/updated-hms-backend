import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { unit_typeService } from './setup_hospital_charges_unit_type.service';
import { SetupHospitalChargesUnitType } from './entities/setup_hospital_charges_unit_type.entity';

@Controller('setup-hospital-charges-unit-type')
export class unit_typecontroller {
  constructor(private readonly unit_typeService: unit_typeService) {}

  @Post()
  create(@Body() unit_typeEntity: SetupHospitalChargesUnitType) {
    return this.unit_typeService.create(unit_typeEntity);
  }

@Get()
findALL() {
  return this.unit_typeService.findAll();
}

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.unit_typeService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() unit_typeEntity:SetupHospitalChargesUnitType) {
    return this.unit_typeService.update(id,unit_typeEntity );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.unit_typeService.remove(id);
  }
}

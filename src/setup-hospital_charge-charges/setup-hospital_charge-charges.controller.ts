import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SetupHospitalChargeChargesService } from './setup-hospital_charge-charges.service';
import { SetupHospitalChargeCharge } from './entities/setup-hospital_charge-charge.entity';
@Controller('setup-hospital-charge-charges')
export class SetupHospitalChargeChargesController {
  constructor(private readonly setupHospitalChargeChargesService: SetupHospitalChargeChargesService) {
    console.log("1234567890");
    
  }

  @Post()
  create(@Body() chargesEntity: SetupHospitalChargeCharge  ) {
    console.log(chargesEntity,"ooooooooooooooooo");
    
    return this.setupHospitalChargeChargesService.create(chargesEntity);
  }

  @Get()
  findAll() {
    return this.setupHospitalChargeChargesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.setupHospitalChargeChargesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body()chargesEntity: SetupHospitalChargeCharge ) {
    return this.setupHospitalChargeChargesService.update(id,chargesEntity );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.setupHospitalChargeChargesService.remove(id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { InternalOpdChargesService } from './internal-opd-charges.service';
import { InternalOpdCharge } from './entities/internal-opd-charge.entity';

@Controller('internal-opd-charges')
export class InternalOpdChargesController {
  constructor(private readonly internalOpdChargesService: InternalOpdChargesService) {}

  @Post()
  create(@Body() InternalOpdChargeentity:InternalOpdCharge) {
    return this.internalOpdChargesService.create(InternalOpdChargeentity);
  }

  @Get()
  findAll(@Query("opd_id")opd_id:number,@Query("patient_id")patient_id:number) {
    return this.internalOpdChargesService.findAll(opd_id,patient_id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body()InternalOpdChargeentity: InternalOpdCharge ) {
    return this.internalOpdChargesService.update(id,InternalOpdChargeentity );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.internalOpdChargesService.remove(id);
  }

}

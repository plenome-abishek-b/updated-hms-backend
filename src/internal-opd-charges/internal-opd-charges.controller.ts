import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
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
  findAll() {
    return this.internalOpdChargesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.internalOpdChargesService.findOne(+id);
  }

  // @Patch(':id')
  // update(@Param('id') id: string, @Body() ) {
  //   return this.internalOpdChargesService.update(+id, );
  // }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.internalOpdChargesService.remove(+id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SetupPharmacySupplierService } from './setup_pharmacy_supplier.service';
import { SetupPharmacySupplier } from './entities/setup_pharmacy_supplier.entity';


@Controller('setup-pharmacy-supplier')
export class SetupPharmacySupplierController {
  constructor(private readonly setupPharmacySupplierService: SetupPharmacySupplierService) {}

  @Post()
  create(@Body() supplierEntity: SetupPharmacySupplier ) {
    return this.setupPharmacySupplierService.create(supplierEntity);
  }

  @Get()
  findAll() {
    return this.setupPharmacySupplierService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.setupPharmacySupplierService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body()  supplierEntity: SetupPharmacySupplier  ) {
    return this.setupPharmacySupplierService.update(id, supplierEntity);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.setupPharmacySupplierService.remove(id);
  }
}

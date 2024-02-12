import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SetupInventoryItemSupplierService } from './setup-inventory-item_supplier.service';
import { SetupInventoryItemSupplier } from './entities/setup-inventory-item_supplier.entity';


@Controller('setup-inventory-item-supplier')
export class SetupInventoryItemSupplierController {
  constructor(private readonly setupInventoryItemSupplierService: SetupInventoryItemSupplierService) {}

  @Post()
  create(@Body() item_supplierEntity: SetupInventoryItemSupplier ) {
    return this.setupInventoryItemSupplierService.create(item_supplierEntity);
  }

  @Get()
  findAll() {
    return this.setupInventoryItemSupplierService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.setupInventoryItemSupplierService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body()  item_supplierEntity: SetupInventoryItemSupplier ) {
    return this.setupInventoryItemSupplierService.update(id,item_supplierEntity );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.setupInventoryItemSupplierService.remove(id);
  }
}

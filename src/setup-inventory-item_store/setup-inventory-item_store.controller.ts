import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SetupInventoryItemStoreService } from './setup-inventory-item_store.service';
import { SetupInventoryItemStore } from './entities/setup-inventory-item_store.entity';


@Controller('setup-inventory-item-store')
export class SetupInventoryItemStoreController {
  constructor(private readonly setupInventoryItemStoreService: SetupInventoryItemStoreService) {}

  @Post()
  create(@Body() item_storeEntity: SetupInventoryItemStore  ) {
    return this.setupInventoryItemStoreService.create(item_storeEntity);
  }

  @Get()
  findAll() {
    return this.setupInventoryItemStoreService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.setupInventoryItemStoreService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() item_storeEntity: SetupInventoryItemStore ) {
    return this.setupInventoryItemStoreService.update(id,item_storeEntity );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.setupInventoryItemStoreService.remove(id);
  }
}

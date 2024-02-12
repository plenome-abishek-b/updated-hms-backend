import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SetupInventoryItemCategoryService } from './setup-inventory-item_category.service';
import { SetupInventoryItemCategory } from './entities/setup-inventory-item_category.entity';


@Controller('setup-inventory-item-category')
export class SetupInventoryItemCategoryController {
  constructor(private readonly setupInventoryItemCategoryService: SetupInventoryItemCategoryService) {}

  @Post()
  create(@Body() item_categoryEntity: SetupInventoryItemCategory) {
    return this.setupInventoryItemCategoryService.create(item_categoryEntity);
  }

  @Get()
  findAll() {
    return this.setupInventoryItemCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.setupInventoryItemCategoryService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body()  item_categoryEntity: SetupInventoryItemCategory ) {
    return this.setupInventoryItemCategoryService.update(id,item_categoryEntity );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.setupInventoryItemCategoryService.remove(id);
  }
}

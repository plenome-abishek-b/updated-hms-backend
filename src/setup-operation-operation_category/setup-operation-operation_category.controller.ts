import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SetupOperationOperationCategoryService } from './setup-operation-operation_category.service';
import { SetupOperationOperationCategory } from './entities/setup-operation-operation_category.entity';

@Controller('setup-operation-operation-category')
export class SetupOperationOperationCategoryController {
  constructor(private readonly setupOperationOperationCategoryService: SetupOperationOperationCategoryService) {}

  @Post()
  create(@Body() operation_categoryService:SetupOperationOperationCategory) {
    return this.setupOperationOperationCategoryService.create(operation_categoryService);
  }

  @Get()
  findAll() {
    return this.setupOperationOperationCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.setupOperationOperationCategoryService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() operation_categoryService:SetupOperationOperationCategory) {
    return this.setupOperationOperationCategoryService.update(id,operation_categoryService );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.setupOperationOperationCategoryService.remove(id);
  }
}

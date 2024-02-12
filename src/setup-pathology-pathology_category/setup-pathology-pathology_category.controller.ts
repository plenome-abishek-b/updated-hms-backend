import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SetupPathologyPathologyCategoryService } from './setup-pathology-pathology_category.service';
import { SetupPathologyPathologyCategory } from './entities/setup-pathology-pathology_category.entity';

@Controller('setup-pathology-pathology-category')
export class SetupPathologyPathologyCategoryController {
  constructor(private readonly setupPathologyPathologyCategoryService: SetupPathologyPathologyCategoryService) {}

  @Post()
  create(@Body() pathology_category_entity: SetupPathologyPathologyCategory) {
    return this.setupPathologyPathologyCategoryService.create(pathology_category_entity);
  }

  @Get()
  findAll() {
    return this.setupPathologyPathologyCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.setupPathologyPathologyCategoryService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() pathology_category_entity: SetupPathologyPathologyCategory) {
    return this.setupPathologyPathologyCategoryService.update(id, pathology_category_entity);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.setupPathologyPathologyCategoryService.remove(id);
  }
}

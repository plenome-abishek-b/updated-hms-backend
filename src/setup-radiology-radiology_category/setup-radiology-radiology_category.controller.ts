import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SetupRadiologyRadiologyCategoryService } from './setup-radiology-radiology_category.service';
import { SetupRadiologyRadiologyCategory } from './entities/setup-radiology-radiology_category.entity';


@Controller('setup-radiology-radiology-category')
export class SetupRadiologyRadiologyCategoryController {
  constructor(private readonly setupRadiologyRadiologyCategoryService: SetupRadiologyRadiologyCategoryService) {}

  @Post()
  create(@Body()  radiology_categoryEntity: SetupRadiologyRadiologyCategory ) {
    return this.setupRadiologyRadiologyCategoryService.create(radiology_categoryEntity);
  }

  

  @Get()
  findAll() {
    return this.setupRadiologyRadiologyCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.setupRadiologyRadiologyCategoryService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body()  radiology_categoryEntity: SetupRadiologyRadiologyCategory  ) {
    return this.setupRadiologyRadiologyCategoryService.update(id, radiology_categoryEntity);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.setupRadiologyRadiologyCategoryService.remove(id);
  }
}

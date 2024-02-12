import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { FindingsCategoryService } from './findings_category.service';
import { FindingsCategory } from './entities/findings_category.entity';


@Controller('findings_category')
export class FindingsCategoryController {
  constructor(private readonly findingsCategoryService: FindingsCategoryService) {}

  @Post()
  create(@Body() finding_category:FindingsCategory) {
    return this.findingsCategoryService.create(finding_category);
  }

  @Get()
  findAll() {
    return this.findingsCategoryService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.findingsCategoryService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() finding_category:FindingsCategory  ) {
    return this.findingsCategoryService.update(id,finding_category );
  }
  
  @Delete(':id')  
  remove(@Param('id') id: string) {
    return this.findingsCategoryService.remove(id); 
  }
}

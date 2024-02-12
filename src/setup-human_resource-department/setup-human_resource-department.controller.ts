import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SetupHumanResourceDepartmentService } from './setup-human_resource-department.service';
import { SetupHumanResourceDepartment } from './entities/setup-human_resource-department.entity';


@Controller('setup-human-resource-department')
export class SetupHumanResourceDepartmentController {
  constructor(private readonly setupHumanResourceDepartmentService: SetupHumanResourceDepartmentService) {}

  @Post()
  create(@Body() departmentEntity: SetupHumanResourceDepartment) {
    return this.setupHumanResourceDepartmentService.create(departmentEntity);
  }

  @Get()
  findAll() {
    return this.setupHumanResourceDepartmentService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.setupHumanResourceDepartmentService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() departmentEntity: SetupHumanResourceDepartment) {
    return this.setupHumanResourceDepartmentService.update(id,departmentEntity );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.setupHumanResourceDepartmentService.remove(id);
  }
}

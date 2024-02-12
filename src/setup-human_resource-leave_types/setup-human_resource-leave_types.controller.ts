import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SetupHumanResourceLeaveTypesService } from './setup-human_resource-leave_types.service';
import { SetupHumanResourceLeaveType } from './entities/setup-human_resource-leave_type.entity';


@Controller('setup-human-resource-leave-types')
export class SetupHumanResourceLeaveTypesController {
  constructor(private readonly setupHumanResourceLeaveTypesService: SetupHumanResourceLeaveTypesService) {}

  @Post()
  create(@Body() leavetypesEntity: SetupHumanResourceLeaveType) {
    return this.setupHumanResourceLeaveTypesService.create(leavetypesEntity);
  }

  @Get()
  findAll() {
    return this.setupHumanResourceLeaveTypesService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.setupHumanResourceLeaveTypesService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() leavetypesEntity: SetupHumanResourceLeaveType ) {
    return this.setupHumanResourceLeaveTypesService.update(id, leavetypesEntity);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.setupHumanResourceLeaveTypesService.remove(id);
  }
}

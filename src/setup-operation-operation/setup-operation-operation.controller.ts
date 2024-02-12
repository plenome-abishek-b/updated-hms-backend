import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SetupOperationOperationService } from './setup-operation-operation.service';
import { SetupOperationOperation } from './entities/setup-operation-operation.entity';

@Controller('setup-operation-operation')
export class SetupOperationOperationController {
  constructor(private readonly setupOperationOperationService: SetupOperationOperationService) {}

  @Post()
  create(@Body() operationEntity: SetupOperationOperation) {
    return this.setupOperationOperationService.create(operationEntity);
  }

  @Get()
  findAll() {
    return this.setupOperationOperationService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.setupOperationOperationService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body()  operationEntity: SetupOperationOperation) {
    return this.setupOperationOperationService.update(id,operationEntity );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.setupOperationOperationService.remove(id);
  }
}

import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SetupFinanceIncomeHeadService } from './setup-finance-income_head.service';
import { SetupFinanceIncomeHead } from './entities/setup-finance-income_head.entity';
@Controller('setup-finance-income-head')
export class SetupFinanceIncomeHeadController {
  constructor(private readonly setupFinanceIncomeHeadService: SetupFinanceIncomeHeadService) {}

  @Post()
  create(@Body() income_headEntity: SetupFinanceIncomeHead ) {
    return this.setupFinanceIncomeHeadService.create(income_headEntity);
  }

  @Get()
  findAll() {
    return this.setupFinanceIncomeHeadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.setupFinanceIncomeHeadService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() income_headEntity: SetupFinanceIncomeHead) {
    return this.setupFinanceIncomeHeadService.update(id,income_headEntity );
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.setupFinanceIncomeHeadService.remove(id);
  }
}

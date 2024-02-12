import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { SetupFinanceExpenseHeadService } from './setup-finance-expense_head.service';
import { SetupFinanceExpenseHead } from './entities/setup-finance-expense_head.entity';

@Controller('setup-finance-expense-head')
export class SetupFinanceExpenseHeadController {
  constructor(private readonly setupFinanceExpenseHeadService: SetupFinanceExpenseHeadService) {}

  @Post()
  create(@Body() expense_headEntity: SetupFinanceExpenseHead ) {
    return this.setupFinanceExpenseHeadService.create(expense_headEntity);
  }

  @Get()
  findAll() {
    return this.setupFinanceExpenseHeadService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.setupFinanceExpenseHeadService.findOne(id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() expense_headEntity: SetupFinanceExpenseHead) {
    return this.setupFinanceExpenseHeadService.update(id, expense_headEntity);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.setupFinanceExpenseHeadService.remove(id);
  }
}

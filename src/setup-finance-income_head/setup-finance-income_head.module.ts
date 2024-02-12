import { Module } from '@nestjs/common';
import { SetupFinanceIncomeHeadService } from './setup-finance-income_head.service';
import { SetupFinanceIncomeHeadController } from './setup-finance-income_head.controller';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SetupFinanceIncomeHead } from './entities/setup-finance-income_head.entity';

@Module({
  imports:[ TypeOrmModule.forFeature([SetupFinanceIncomeHead])],

  controllers: [SetupFinanceIncomeHeadController],
  providers: [SetupFinanceIncomeHeadService,DynamicDatabaseService],
})
export class SetupFinanceIncomeHeadModule {}

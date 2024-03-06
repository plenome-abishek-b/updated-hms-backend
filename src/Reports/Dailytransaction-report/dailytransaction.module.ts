import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DailyTransactionReportController } from './dailytransaction.controller';
import { DailyTransactionReportService } from './dailytransaction.service';
import { Transaction } from './dailytransaction.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Transaction])],
  controllers: [DailyTransactionReportController],
  providers: [DailyTransactionReportService],
})
export class DailyTransactionReportModule {}

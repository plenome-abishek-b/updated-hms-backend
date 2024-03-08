
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { IncomeSummaryController } from './overallincome.controller';
import { IncomeSummary } from './entities/overallincome.entity';
import { IncomeSummaryService } from './overallincome.service';

@Module({
  imports: [TypeOrmModule.forFeature([IncomeSummary])],
  controllers: [IncomeSummaryController],
  providers: [IncomeSummaryService],
})
export class IncomeSummaryModule {}

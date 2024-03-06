
    import { Module } from '@nestjs/common';
    import { TypeOrmModule } from '@nestjs/typeorm';
    import { IpdDetailsEntity } from './ipd-report.entity';
    import { IpdReportService } from './ipd-report.service';
    import { IpdReportController } from './ipd-report.controller';
    
    @Module({
      imports: [TypeOrmModule.forFeature([IpdDetailsEntity])],
      providers: [IpdReportService],
      controllers: [IpdReportController],
      exports: [IpdReportService],
    })
    export class IpdDetailsReportModule {}
    
    
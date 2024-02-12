import { Module } from '@nestjs/common';
import { SetupPharmacyDoseDurationService } from './setup_pharmacy_dose_duration.service';
import { SetupPharmacyDoseDurationController } from './setup_pharmacy_dose_duration.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SetupPharmacyDoseDuration } from './entities/setup_pharmacy_dose_duration.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';

@Module({
  imports:[ TypeOrmModule.forFeature([SetupPharmacyDoseDuration])],

  controllers: [SetupPharmacyDoseDurationController],
  providers: [SetupPharmacyDoseDurationService,DynamicDatabaseService],
})
export class SetupPharmacyDoseDurationModule {}

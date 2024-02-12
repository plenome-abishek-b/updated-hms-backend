import { Module } from '@nestjs/common';
import { SetupPharmacyMedicineDosageService } from './setup_pharmacy_medicine_dosage.service';
import { SetupPharmacyMedicineDosageController } from './setup_pharmacy_medicine_dosage.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SetupPharmacyMedicineDosage } from './entities/setup_pharmacy_medicine_dosage.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';

@Module({
  imports:[ TypeOrmModule.forFeature([SetupPharmacyMedicineDosage])],

  controllers: [SetupPharmacyMedicineDosageController],
  providers: [SetupPharmacyMedicineDosageService,DynamicDatabaseService],
})
export class SetupPharmacyMedicineDosageModule {}

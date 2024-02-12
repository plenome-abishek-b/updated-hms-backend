import { Module } from '@nestjs/common';
import { SetupHospitalChargeChargesService } from './setup-hospital_charge-charges.service';
import { SetupHospitalChargeChargesController } from './setup-hospital_charge-charges.controller';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SetupHospitalChargeCharge } from './entities/setup-hospital_charge-charge.entity';

@Module({
  imports:[ TypeOrmModule.forFeature([SetupHospitalChargeCharge])],

  controllers: [SetupHospitalChargeChargesController],
  providers: [SetupHospitalChargeChargesService,DynamicDatabaseService],
})
export class SetupHospitalChargeChargesModule {}

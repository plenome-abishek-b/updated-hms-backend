import { Module } from '@nestjs/common';
import { SetupPharmacySupplierService } from './setup_pharmacy_supplier.service';
import { SetupPharmacySupplierController } from './setup_pharmacy_supplier.controller';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SetupPharmacySupplier } from './entities/setup_pharmacy_supplier.entity';

@Module({
  imports:[ TypeOrmModule.forFeature([SetupPharmacySupplier])],

  controllers: [SetupPharmacySupplierController],
  providers: [SetupPharmacySupplierService,DynamicDatabaseService],
})
export class SetupPharmacySupplierModule {}

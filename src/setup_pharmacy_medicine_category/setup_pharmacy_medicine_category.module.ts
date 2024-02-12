
import { Module } from '@nestjs/common';
import { MedicineCategoryController } from './setup_pharmacy_medicine_category.controller';
import { MedicineCategoryService } from './setup_pharmacy_medicine_category.service';
import { DynamicDatabaseService } from 'src/dynamic_db.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SetupPharmacyMedicineCategory } from './entities/setup_pharmacy_medicine_category.entity';

@Module({
  imports:[ TypeOrmModule.forFeature([SetupPharmacyMedicineCategory])],

  controllers: [MedicineCategoryController],
  providers: [MedicineCategoryService,DynamicDatabaseService],
})
export class MedicineCategoryModule {}
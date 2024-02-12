import { Module } from '@nestjs/common';
import { SetupInventoryItemCategoryService } from './setup-inventory-item_category.service';
import { SetupInventoryItemCategoryController } from './setup-inventory-item_category.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SetupInventoryItemCategory } from './entities/setup-inventory-item_category.entity';
import { DynamicDatabaseService } from 'src/dynamic_db.service';

@Module({
  imports:[ TypeOrmModule.forFeature([SetupInventoryItemCategory])],

  controllers: [SetupInventoryItemCategoryController],
  providers: [SetupInventoryItemCategoryService,DynamicDatabaseService],
})
export class SetupInventoryItemCategoryModule {}

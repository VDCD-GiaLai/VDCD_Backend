// src/modules/operation-field/operation-field.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { OperationField } from './entities/operation-field.entity';
import { OperationFieldService } from './operation-field.service';
import { OperationFieldController } from './operation-field.controller';

@Module({
  imports: [TypeOrmModule.forFeature([OperationField])],
  providers: [OperationFieldService],
  controllers: [OperationFieldController],
  exports: [OperationFieldService],
})
export class OperationFieldModule {}

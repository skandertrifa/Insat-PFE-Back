import { TypeOrmModule } from '@nestjs/typeorm';
import { AnneeEntity } from './entities/annee.entity';
import { Module } from '@nestjs/common';
import { AnneeService } from './annee.service';
import { AnneeController } from './annee.controller';
import * as dotenv from 'dotenv'
dotenv.config();
@Module({
  controllers: [AnneeController],
  providers: [AnneeService],
  imports: [ 
  TypeOrmModule.forFeature([AnneeEntity])
  ]
})
export class AnneeModule {}




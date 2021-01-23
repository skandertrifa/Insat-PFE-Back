import { AnneeEntity } from 'src/gestion-annee/entities/annee.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AnneeController } from './annee.controller';
import { AnneeService } from './annee.service';
import { Module } from '@nestjs/common';

@Module({
  controllers: [AnneeController],
  providers: [AnneeService],
  imports: [ 
  TypeOrmModule.forFeature([AnneeEntity])
  ],
  exports:[AnneeService]
})
export class GestionAnneeModule {}

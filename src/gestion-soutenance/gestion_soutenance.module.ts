import { SujetEntity } from './entities/sujet.entity';
import { SalleEntity } from './entities/salle.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SalleService } from './salle.service';
import { SalleController } from './salle.controller';
import { SujetController } from './sujet.controller';
import { SujetService } from './sujet.service';

@Module({
  controllers: [SalleController, SujetController],
  providers: [SalleService, SujetService],
  imports: [ 
    TypeOrmModule.forFeature([SalleEntity,SujetEntity])
  ]
})
export class GestionSoutenanceModule {}

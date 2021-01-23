import { GestionSessionModule } from './../gestion-session/gestion_session.module';
import { SoutenanceEntity } from './entities/soutenance.entity';
import { SoutenanceService } from './soutenance.service';
import { SoutenanceController } from './soutenance.controller';
import { SujetEntity } from './entities/sujet.entity';
import { SalleEntity } from './entities/salle.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SalleService } from './salle.service';
import { SalleController } from './salle.controller';
import { SujetController } from './sujet.controller';
import { SujetService } from './sujet.service';


@Module({
  controllers: [SalleController, SujetController,SoutenanceController],
  providers: [SalleService, SujetService,SoutenanceService],
  imports: [ 
    TypeOrmModule.forFeature([SalleEntity,SujetEntity,SoutenanceEntity]),
    GestionSessionModule
  ],
  exports:[
    SoutenanceService
  ]
})
export class GestionSoutenanceModule {}

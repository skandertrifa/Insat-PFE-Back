import { JuryController } from './jury.controller';
import { GestionSessionModule } from './../gestion-session/gestion_session.module';
import { SoutenanceEntity } from './entities/soutenance.entity';
import { SoutenanceService } from './soutenance.service';
import { SoutenanceController } from './soutenance.controller';
import { TeacherEntity } from 'src/auth/entities/teacher.entity';
import { JuryEntity } from './entities/jury.entity';
import { SujetEntity } from './entities/sujet.entity';
import { SalleEntity } from './entities/salle.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SalleService } from './salle.service';
import { SalleController } from './salle.controller';
import { SujetController } from './sujet.controller';
import { SujetService } from './sujet.service';

import { JuryService } from './jury.service';


@Module({
  controllers: [SalleController, SujetController,SoutenanceController,JuryController],
  providers: [SalleService, SujetService,SoutenanceService,JuryService],
  imports: [ 
    TypeOrmModule.forFeature([SalleEntity,SujetEntity,SoutenanceEntity,JuryEntity,TeacherEntity]),
    GestionSessionModule
  ],
  exports:[
    SoutenanceService
  ]
})
export class GestionSoutenanceModule {}

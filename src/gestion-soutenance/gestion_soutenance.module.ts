import { RapportPfeEntity } from './entities/rapportPfe.entity';
import { UserEntity } from './../auth/entities/user.entity';
import { StudentEntity } from './../auth/entities/student.entity';
import { JuryController } from './controllers/jury.controller';
import { GestionSessionModule } from './../gestion-session/gestion_session.module';
import { SoutenanceEntity } from './entities/soutenance.entity';
import { SoutenanceService } from './services/soutenance.service';
import { SoutenanceController } from './controllers/soutenance.controller';
import { TeacherEntity } from 'src/auth/entities/teacher.entity';
import { JuryEntity } from './entities/jury.entity';
import { SujetEntity } from './entities/sujet.entity';
import { SalleEntity } from './entities/salle.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SalleService } from './services/salle.service';
import { SalleController } from './controllers/salle.controller';
import { SujetController } from './controllers/sujet.controller';
import { SujetService } from './services/sujet.service';

import { JuryService } from './services/jury.service';
import { FichePropositionPfeEntity } from './entities/fichePropositionPfe.entity';
import { LettreAffectationPfeEntity } from './entities/lettreAffectation.entity';



@Module({
  controllers: [SalleController, SujetController,SoutenanceController,JuryController],
  providers: [SalleService, SujetService,SoutenanceService,JuryService],
  imports: [ 
    TypeOrmModule.forFeature([SalleEntity,SujetEntity,
      SoutenanceEntity,JuryEntity,
      TeacherEntity,StudentEntity,FichePropositionPfeEntity,
      UserEntity,RapportPfeEntity,LettreAffectationPfeEntity]),
    GestionSessionModule,
    StudentEntity
  ],
  exports:[
    SoutenanceService
  ]
})
export class GestionSoutenanceModule {}

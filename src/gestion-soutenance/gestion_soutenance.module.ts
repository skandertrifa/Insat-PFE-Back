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
import { JuryController } from './jury.controller';
import { JuryService } from './jury.service';

@Module({
  controllers: [SalleController, SujetController, JuryController],
  providers: [SalleService, SujetService, JuryService],
  imports: [ 
    TypeOrmModule.forFeature([SalleEntity,SujetEntity,JuryEntity,TeacherEntity])
  ]
})
export class GestionSoutenanceModule {}

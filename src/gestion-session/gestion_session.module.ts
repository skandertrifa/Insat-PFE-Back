
import { GestionAnneeModule } from './../gestion-annee/gestion_annee.module';

import { SessionEntity } from './entities/session.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module, forwardRef } from '@nestjs/common';
import { SessionService } from './services/session.service';
import { SessionController } from './controllers/session.controller';


@Module({
  controllers: [SessionController],
  providers: [SessionService],
  imports: [ 
    
    TypeOrmModule.forFeature([SessionEntity]),
    forwardRef(() =>GestionAnneeModule),
  ],
  exports:[
    SessionService
  ]
})
export class GestionSessionModule {}

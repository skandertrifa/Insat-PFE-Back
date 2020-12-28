import { SalleEntity } from './entities/salle.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SalleService } from './salle.service';
import { SalleController } from './salle.controller';

@Module({
  controllers: [SalleController],
  providers: [SalleService],
  imports: [ 
    TypeOrmModule.forFeature([SalleEntity])
  ]
})
export class GestionSoutenanceModule {}

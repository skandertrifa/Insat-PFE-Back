import { SessionEntity } from './entities/session.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Module } from '@nestjs/common';
import { SessionService } from './session.service';
import { SessionController } from './session.controller';


@Module({
  controllers: [SessionController],
  providers: [SessionService],
  imports: [ 
    TypeOrmModule.forFeature([SessionEntity])
  ]
})
export class GestionSessionModule {}

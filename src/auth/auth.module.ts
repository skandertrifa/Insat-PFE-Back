import { RapportPfeEntity } from './../gestion-soutenance/entities/rapportPfe.entity';
import { StudentEntity } from './entities/student.entity';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserEntity } from './entities/user.entity';
import * as dotenv from 'dotenv'
import { PassportJWTStrategy } from './strategy/passport-jwt.strategy';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { RapportController } from './rapport.controller';
import { RapportService } from './rapport.service';
dotenv.config();
@Module({
  controllers: [AuthController, StudentController, RapportController],
  providers: [AuthService, PassportJWTStrategy, StudentService, RapportService],
  imports: [ 
    TypeOrmModule.forFeature([UserEntity,StudentEntity,RapportPfeEntity]),
    PassportModule.register({defaultStrategy: 'jwt'}),
    JwtModule.register({
      secret: process.env.SECRET,
      signOptions:{
        expiresIn: 36000,
      }
    })
  ]
})
export class AuthModule {}

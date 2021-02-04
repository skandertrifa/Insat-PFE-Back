import { TeacherEntity } from 'src/auth/entities/teacher.entity';
import { RapportPfeEntity } from './../gestion-soutenance/entities/rapportPfe.entity';
import { StudentEntity } from './entities/student.entity';
import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './controllers/auth.controller';
import { AuthService } from './services/auth.service';
import { UserEntity } from './entities/user.entity';
import * as dotenv from 'dotenv'
import { PassportJWTStrategy } from './strategy/passport-jwt.strategy';
import { StudentController } from './controllers/student.controller';
import { StudentService } from './services/student.service';
import { RapportController } from './controllers/rapport.controller';
import { RapportService } from './services/rapport.service';
import { TeacherController } from './controllers/teacher.controller';
import { TeacherService } from './services/teacher.service';
dotenv.config();
@Module({
  controllers: [AuthController, StudentController, RapportController, TeacherController],
  providers: [AuthService, PassportJWTStrategy, StudentService, RapportService, TeacherService],
  imports: [ 
    TypeOrmModule.forFeature([UserEntity,StudentEntity,RapportPfeEntity,TeacherEntity]),
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

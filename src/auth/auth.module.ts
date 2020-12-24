import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UserEntity } from './entities/user.entity';
import * as dotenv from 'dotenv'
import { PassportJWTStrategy } from './strategy/passport-jwt.strategy';
dotenv.config();
@Module({
  controllers: [AuthController],
  providers: [AuthService, PassportJWTStrategy],
  imports: [ 
    TypeOrmModule.forFeature([UserEntity]),
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

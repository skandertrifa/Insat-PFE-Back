import { PassportStrategy } from "@nestjs/passport";
import { ExtractJwt, Strategy } from "passport-jwt";
import * as dotenv from 'dotenv';
import { Repository } from "typeorm";
import { UserEntity } from "../entities/user.entity";
import { InjectRepository } from "@nestjs/typeorm";
import { UnauthorizedException } from '@nestjs/common';
dotenv.config();

export class PassportJWTStrategy extends PassportStrategy(Strategy){ 
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>
    ){
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
            ignoreExpiration: false,
            secretOrKey: process.env.SECRET,
          });
    }

    async validate(payload: any){
        console.log(payload);
        const user = await this.userRepository.findOne({email: payload.email});
        if (user){
            delete user.salt;
            delete user.password;
            return user;
        }
        else{
            throw new UnauthorizedException();
        }
    }
}
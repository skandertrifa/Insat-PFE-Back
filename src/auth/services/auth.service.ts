import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { UserRegisterDto } from '../dto/user-register';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { UserEntity } from '../entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { UserLoginDto } from '../dto/user-login';
import { JwtService } from '@nestjs/jwt';


@Injectable()
export class AuthService 
{
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        private jwtService: JwtService
    ){}

    async register(userRegisterDto: UserRegisterDto): Promise<Partial<UserEntity>>{
        const user = this.userRepository.create({
            ...userRegisterDto
        });
        user.salt = await bcrypt.genSalt();
        user.password = await bcrypt.hash(user.password,user.salt);
        try{
            await this.userRepository.save(user);
        }
        catch (e) {
            throw new ConflictException('email already exists');
        }

        return {
            id: user.id,
            nom: user.nom,
            prenom: user.prenom,
            email: user.email,
        };
    }


    async login(credentilas: UserLoginDto){
        const { email, password} = credentilas;
        const user = await this.userRepository.findOne({email});
        if (!user){
            throw new NotFoundException('email or password incorrent');
        }
        else{
            if ( await bcrypt.compare(password, user.password)){
                const payload = {
                    email: user.email,
                    nom: user.nom,
                    prenom: user.prenom
                };
                const jwt = this.jwtService.sign(payload);
                return { 
                    "access_token": jwt
                };
            }
            else{
                throw new NotFoundException('email or password wrong')
            }
        }
    }


}

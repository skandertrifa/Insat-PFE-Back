import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from '../services/auth.service';
import { UserRegisterDto } from '../dto/user-register';
import { UserEntity } from '../entities/user.entity';
import { UserLoginDto } from '../dto/user-login';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {

    constructor(
        private authService: AuthService
    ){}

    @Post('register')
    async register (
        @Body() userData: UserRegisterDto
    ): Promise<Partial<UserEntity>>{
        return await this.authService.register(userData)
    }

    @Post('login')
    async login (
        @Body() credentials: UserLoginDto
    ){
        return await this.authService.login(credentials);
    }

    
    
    
}
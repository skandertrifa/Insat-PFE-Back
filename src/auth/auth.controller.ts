import { studentsFileMetadata } from './utils/studentsFileMetadata.class';
import { editFileNameRapporPfe, rapportPfeFileFilter, editFileNameStudents, studentsFileFilter } from './utils/file-uploads.utils';
import { BadRequestException, Body, Controller, NotAcceptableException, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor, MulterModule } from '@nestjs/platform-express'
import { AuthService } from './auth.service';
import { UserRegisterDto } from './dto/user-register';
import { UserEntity } from './entities/user.entity';
import { UserLoginDto } from './dto/user-login';
import { diskStorage } from 'multer';
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
    
    //Rapport PFE Upload 
    @UseGuards(AuthGuard('jwt'))
    @Post('upload/rapportPFE')
    @UseInterceptors(FileInterceptor("rapportPFE",{
    storage: diskStorage({
        destination:"uploads/rapportsPFE",
        filename:editFileNameRapporPfe,
    }),
    fileFilter:rapportPfeFileFilter
    }))
    async uploadRapportPfe(@UploadedFile() file,@Req() req) {
        if (req.fileValidationError) {
            throw new BadRequestException(req.fileValidationError);
        }
        if (!file) {
            throw new BadRequestException('Fichier invalide');
        }
        try{
        await this.authService.updateRapportPfePath(req.user,file.path);
        }catch(e){
            throw new Error("Impossible d'enregistrer le fichier")
        }
        return {message: `Fichier ${file.originalname} téléchargé avec succés`};
    }


    //upload excel file of students and geenrate them in db
    //TODO: add guards (Admin only)
    @Post('upload/students')
    @UseInterceptors(FileInterceptor("students",{
    storage: diskStorage({
        destination:"uploads/students",
        filename:editFileNameStudents,
    }),
    fileFilter:studentsFileFilter
    }))
    async uploadStudents(@UploadedFile() file,@Req() req,@Body() metadata:studentsFileMetadata) {
        if (req.fileValidationError) {
            throw new BadRequestException(req.fileValidationError);
        }

        if (!file) {
            throw new BadRequestException('Fichier Invalide');
        }
    
        return this.authService.generateStudents(metadata,file.path) 


    }
}
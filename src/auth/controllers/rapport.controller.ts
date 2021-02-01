import { RapportService } from '../services/rapport.service';
import { editFileNameRapporPfe, rapportPfeFileFilter } from '../utils/file-uploads.utils';
import { BadRequestException,Controller, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer';
import { AuthGuard } from '@nestjs/passport';

@Controller('rapport')
export class RapportController {


    constructor(
        private rapportService: RapportService
    ){}

    //Rapport PFE Upload 
    @UseGuards(AuthGuard('jwt'))
    @Post('upload')
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
        console.log('hereeee')
        await this.rapportService.updateRapportPfe(req.user,file.path);
        }catch(e){
            return e
        }
        return {message: `Fichier ${file.originalname} téléchargé avec succés`};
    }
}

import { SujetService } from '../services/sujet.service';
import { SujetDto } from '../dto/sujet.dto';
import { Body, Controller, Get, Post, Put,Delete, Param, ParseIntPipe, Query} from '@nestjs/common';


@Controller('sujet')
export class SujetController {
    constructor(
        private sujetService: SujetService
    ){}
  // create sujet , msut include with it fiche proposition
  @UseGuards(AuthGuard('jwt'))
  @Post()
  @UseInterceptors(FileInterceptor("fichePropositionPfe",{
      storage: diskStorage({
          destination:"uploads/fichesPropositionPfe",
          filename:editFichePropositionpfe,
      }),
      fileFilter:fichePropositionPfeFileFilter
      }))
  create(
      @Body() sujet:SujetDto,
      @Req() req,
      @UploadedFile() file,
      
  ){

      if (req.fileValidationError) {
          throw new BadRequestException(req.fileValidationError);
      }
      if (!file) {
          throw new BadRequestException('Fichier invalide');
      }
      
      return this.sujetService.create(sujet,req.user,file.path);

  }

    @Get()
    findAll(@Query('page', ParseIntPipe) page = 1){
        return this.sujetService.findAllPaginated(page);
    }

    @Get(':id')
    findOne(
        @Param('id') id:string
    ){
        return this.sujetService.findOne(+id);
    }

    @Put(':id')
    updateOne(
        @Param('id') id:string,
        @Body() sujet:SujetDto
    ){
        return this.sujetService.update(+id,sujet);

    }

    @Delete(':id')
    delete(
        @Param('id') id:string
    ){  console.log('sujet controller')
        return this.sujetService.delete(+id);

    }

    // downlaod fiche prop
    @Get('/downloadFicheProp/:id')
	@Header('Content-type', 'application/pdf')
	async downloadFicheProp(
		@Param('id') id: string,
		@Req() req,
	): Promise<Buffer> {
		const pdf = await this.sujetService.downloadFile(+id,'ficheprop');
		return pdf;
    }
    
    //download lettre affirmarion
    @Get('/downloadLettre/:id')
	@Header('Content-type', 'application/pdf')
	async downloadLettre(
		@Param('id') id: string,
		@Req() req,
	): Promise<Buffer> {
		const pdf = await this.sujetService.downloadFile(+id,'lettre');
		return pdf;
    }
    
    //download rapport
    @Get('/downloadRapport/:id')
	@Header('Content-type', 'application/pdf')
	async downloadRapport(
		@Param('id') id: string,
		@Req() req,
	): Promise<Buffer> {
		const pdf = await this.sujetService.downloadFile(+id,'rapport');
		return pdf;
    }
    
    //Rapport PFE Upload
    @UseGuards(AuthGuard('jwt'))
    @Post('upload/rapport')
    @UseInterceptors(FileInterceptor("rapportPFE",{
    storage: diskStorage({
        destination:"uploads/rapportsPFE",
        filename:editFileNameRapporPfe,
    }),
    fileFilter:rapportPfeFileFilter
    }))
    async uploadRapport(@UploadedFile() file,@Req() req) {
        if (req.fileValidationError) {
            throw new BadRequestException(req.fileValidationError);
        }
        if (!file) {
            throw new BadRequestException('Fichier invalide');
        }
        try{
        console.log('hereeee')
        await this.sujetService.updateRapportPfe(req.user,file.path);
        }catch(e){
            return e
        }
        return {message: `Fichier ${file.originalname} téléchargé avec succés`};
    }
    

    //Lettre affirmation upload
    @UseGuards(AuthGuard('jwt'))
    @Post('upload/lettreAffirmation/:id')
    @UseInterceptors(FileInterceptor("lettreAffirmation",{
    storage: diskStorage({
        destination:"uploads/lettresAffirmationPfe",
        filename:editFileNameRapporPfe,
    }),
    fileFilter:rapportPfeFileFilter
    }))
    async uploadLettreAffirmation(@UploadedFile() file,@Req() req,@Param('id') id) {
        if (req.fileValidationError) {
            throw new BadRequestException(req.fileValidationError);
        }
        if (!file) {
            throw new BadRequestException('Fichier invalide');
        }
        try{
        await this.sujetService.updateLettreAffirmation(+id,file.path);
        }catch(e){
            return e
        }
        return {message: `Fichier ${file.originalname} téléchargé avec succés`};
    }

    
    
}

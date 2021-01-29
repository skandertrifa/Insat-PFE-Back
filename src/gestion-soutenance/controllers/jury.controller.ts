import { JuryService } from '../services/jury.service';
import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { JuryDto } from '../dto/jury.dto';

@Controller('jury')
export class JuryController {

    constructor(
        private juryService: JuryService
    ){}

    @Post()
    create(
        @Body() sujet:JuryDto
    ){
        return this.juryService.create(sujet);
    }

    @Get()
    findAll(){
        return this.juryService.findAll();
    }
    
    @Get(':id')
    findOne(
        @Param('id') id:string
    ){
        //return this.juryService.findOne(+id);
    }

    @Delete(':id')
    delete(
        @Param('id') id:string
    ){
        return this.juryService.delete(+id);

    }
}

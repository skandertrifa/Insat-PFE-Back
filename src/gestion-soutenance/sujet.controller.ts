import { SujetService } from './sujet.service';
import { SujetDto } from './dto/sujet.dto';
import { Body, Controller, Get, Post, Put,Delete, Param} from '@nestjs/common';
import { runInThisContext } from 'vm';

@Controller('sujet')
export class SujetController {
    constructor(
        private sujetService: SujetService
    ){}

    @Post()
    create(
        @Body() sujet:SujetDto
    ){
        return this.sujetService.create(sujet);
    }

    @Get()
    findAll(){
        return this.sujetService.findAll();
    }

    @Get(':id')
    findOne(
        @Param('id') id:String
    ){
        return this.sujetService.findOne(+id);
    }

    @Put(':id')
    updateOne(
        @Param('id') id:String,
        @Body() sujet:SujetDto
    ){
        return this.sujetService.update(+id,sujet);

    }

    @Delete(':id')
    delete(
        @Param('id') id:String
    ){
        return this.sujetService.delete(+id);

    }
    
}

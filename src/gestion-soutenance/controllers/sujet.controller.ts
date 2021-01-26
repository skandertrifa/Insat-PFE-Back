import { SujetService } from '../services/sujet.service';
import { SujetDto } from '../dto/sujet.dto';
import { Body, Controller, Get, Post, Put,Delete, Param} from '@nestjs/common';


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
        @Param('id') id:number
    ){
        return this.sujetService.findOne(+id);
    }

    @Put(':id')
    updateOne(
        @Param('id') id:number,
        @Body() sujet:SujetDto
    ){
        return this.sujetService.update(+id,sujet);

    }

    @Delete(':id')
    delete(
        @Param('id') id:number
    ){
        return this.sujetService.delete(+id);

    }
    
}

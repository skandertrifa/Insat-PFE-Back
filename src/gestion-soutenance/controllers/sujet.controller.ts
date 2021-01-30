import { SujetService } from '../services/sujet.service';
import { SujetDto } from '../dto/sujet.dto';
import { Body, Controller, Get, Post, Put,Delete, Param, ParseIntPipe, Query} from '@nestjs/common';


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
    ){
        return this.sujetService.delete(+id);

    }
    
}

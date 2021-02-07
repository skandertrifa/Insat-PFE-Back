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
        @Body() jury:JuryDto
    ){
        return this.juryService.create(jury);
    }

    @Get()
    findAll(){
        return this.juryService.findAll();
    }
    
    @Get(':id')
    findOne(
        @Param('id') id:string
    ){
        return this.juryService.findOne(+id);
    }

    @Put(':id')
    updateOne(
        @Param('id') id:string,
        @Body() juryUpdate : JuryDto
    ){
        return this.juryService.update(juryUpdate,+id);
    }

    @Delete(':id')
    delete(
        @Param('id') id:string
    ){
        return this.juryService.delete(+id);

    }
}

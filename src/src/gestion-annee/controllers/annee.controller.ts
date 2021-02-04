import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { AnneeService } from '../services/annee.service';
import { AnneeDto } from '../dto/annee.dto';


@Controller('annee')
export class AnneeController {
  constructor(private readonly Service: AnneeService) {}
  
  @Post()
  create(@Body() createDto: AnneeDto) {
    return this.Service.create(createDto);
  }

  @Get()
  findAll() {
    return this.Service.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.Service.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: AnneeDto) {
    return this.Service.update(+id, updateDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.Service.delete(+id);
  }
}

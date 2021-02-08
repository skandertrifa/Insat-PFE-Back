import { Controller, Get, Post, Body, Put, Param, Delete, UseGuards } from '@nestjs/common';
import { AnneeService } from '../services/annee.service';
import { AnneeDto } from '../dto/annee.dto';
import { AuthGuard } from '@nestjs/passport';


@Controller('annee')
export class AnneeController {
  constructor(private readonly Service: AnneeService) {}
  
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createDto: AnneeDto) {
    return this.Service.create(createDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  findAll() {
    return this.Service.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.Service.findOne(+id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id') id: string, @Body() updateDto: AnneeDto) {
    return this.Service.update(+id, updateDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.Service.delete(+id);
  }
}

import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { SalleService } from './salle.service';
import { CreateSalleDto } from './dto/create-salle.dto';
import { UpdateSalleDto } from './dto/update-salle.dto';

@Controller('salle')
export class SalleController {
  constructor(private readonly salleService: SalleService) {}

  @Post()
  create(@Body() createSalleDto: CreateSalleDto) {
    return this.salleService.create(createSalleDto);
  }

  @Get()
  findAll() {
    return this.salleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.salleService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSalleDto: UpdateSalleDto) {
    return this.salleService.update(+id, updateSalleDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.salleService.delete(+id);
  }
}

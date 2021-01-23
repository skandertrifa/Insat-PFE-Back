import { Controller, Get, Post, Body, Put, Param, Delete } from '@nestjs/common';
import { SoutenanceService } from './soutenance.service';
import { CreateSoutenanceDto } from './dto/create-soutenance.dto';
import { UpdateSoutenanceDto } from './dto/update-soutenance.dto';

@Controller('soutenance')
export class SoutenanceController {
  constructor(private readonly soutenanceService: SoutenanceService) {}

  @Post()
  create(@Body() createSoutenanceDto: CreateSoutenanceDto) {
    return this.soutenanceService.create(createSoutenanceDto);
  }

  @Get()
  findAll() {
    return this.soutenanceService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.soutenanceService.findOne(+id);
  }

  @Put(':id')
  update(@Param('id') id: string, @Body() updateSoutenanceDto: UpdateSoutenanceDto) {
    return this.soutenanceService.update(+id, updateSoutenanceDto);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.soutenanceService.delete(+id);
  }
}

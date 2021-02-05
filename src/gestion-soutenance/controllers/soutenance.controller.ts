import { Controller, Get, Post, Body, Put, Param, Delete, Query, ParseIntPipe } from '@nestjs/common';
import { SoutenanceService } from '../services/soutenance.service';
import { CreateSoutenanceDto } from '../dto/create-soutenance.dto';
import { UpdateSoutenanceDto } from '../dto/update-soutenance.dto';

@Controller('soutenance')
export class SoutenanceController {
  constructor(private readonly soutenanceService: SoutenanceService) {}

  @Get('event')
  findAllEvents() {
    return this.soutenanceService.findAll();
  }

  @Post()
  create(@Body() createSoutenanceDto: CreateSoutenanceDto) {
    return this.soutenanceService.create(createSoutenanceDto);
  }

  @Get()
  async findAll(@Query('page', ParseIntPipe) page = 1,@Query('limit', ParseIntPipe) limit=10) {
    return this.soutenanceService.findAllPaginated(page,limit);
    
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

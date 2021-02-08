import { Controller, Get, Post, Body, Put, Param, Delete, Query, ParseIntPipe, UseGuards, Req, UseInterceptors } from '@nestjs/common';
import { SoutenanceService } from '../services/soutenance.service';
import { CreateSoutenanceDto } from '../dto/create-soutenance.dto';
import { UpdateSoutenanceDto } from '../dto/update-soutenance.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('soutenance')
export class SoutenanceController {
  constructor(private readonly soutenanceService: SoutenanceService) {}


  @Get('event')
  findAllEvents() {
    return this.soutenanceService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('catalogue')
  getCatalogue() {
    return this.soutenanceService.getCatalogue();
  }
  
  @UseGuards(AuthGuard('jwt'))
  @Post()
  create(@Body() createSoutenanceDto: CreateSoutenanceDto) {
    return this.soutenanceService.create(createSoutenanceDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async findAll(@Query('page', ParseIntPipe) page = 1,@Query('limit', ParseIntPipe) limit=10) {
    return this.soutenanceService.findAllPaginated(page,limit);
    
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.soutenanceService.findOne(+id);
  }


  
  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  update(@Param('id') id: string, @Body() updateSoutenanceDto: UpdateSoutenanceDto) {
    return this.soutenanceService.update(+id, updateSoutenanceDto);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.soutenanceService.delete(+id);
  }

  

  
}

import { CreateTeacherDto } from './../dto/create-teacher';
import { teachersFileMetadata } from '../utils/teachersFileMetadata.class';
import { TeacherService } from '../services/teacher.service';
import {
    BadRequestException,
    Body,
    Controller,
    Delete,
    Get,
    Param, ParseIntPipe,
    Post,
    Query,
    Req,
    UploadedFile,
    UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer';
import { editFileNameTeachers, teachersFileFilter } from '../utils/file-uploads.utils';
import {Pagination} from "nestjs-typeorm-paginate";
import {TeacherEntity} from "../entities/teacher.entity";

@Controller('teacher')
export class TeacherController {


    constructor(
        private teacherService: TeacherService
    ){}
    @Get('paginate')
    async index(
        @Query('page', ParseIntPipe) page = 1,
        @Query('limit', ParseIntPipe) limit = 10,
    ): Promise<Pagination<TeacherEntity>> {
        console.log("i'm here");
        limit = limit > 100 ? 100 : limit;
        return this.teacherService.paginate({
            page,
            limit,
            route: 'http://localhost:4200/Teacher',
        });
    }

    @Post()
    createTeacher(@Body() createTeacherDto:CreateTeacherDto ){
      return this.teacherService.create(createTeacherDto);
    }

    // get paginated


    //upload excel file of teachers and geenrate them in db
    //TODO: add guards (Admin only)
    @Post('upload')
    @UseInterceptors(FileInterceptor("teachers",{
    storage: diskStorage({
        destination:"uploads/teachers",
        filename:editFileNameTeachers,
    }),
    fileFilter:teachersFileFilter
    }))
    async uploadTeachers(@UploadedFile() file,@Req() req,@Body() metadata:teachersFileMetadata) {
        if (req.fileValidationError) {
            throw new BadRequestException(req.fileValidationError);
        }

        if (!file) {
            throw new BadRequestException('Fichier Invalide');
        }
    
        return this.teacherService.generateTeachers(metadata,file.path) 


    }

    //get all 
    @Get()
    findAll(){
        return this.teacherService.findAll();
    }


    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.teacherService.findOne(+id);
    }
  
  
    @Delete(':id')
    delete(@Param('id') id: string) {
      return this.teacherService.delete(+id);
    }
}

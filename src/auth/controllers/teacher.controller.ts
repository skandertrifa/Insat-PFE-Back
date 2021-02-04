import { CreateTeacherDto } from './../dto/create-teacher';
import { teachersFileMetadata } from '../utils/teachersFileMetadata.class';
import { TeacherService } from '../services/teacher.service';
import { BadRequestException, Body, Controller, Delete, Get, Param, Post, Req, UploadedFile, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer';
import { editFileNameTeachers, teachersFileFilter } from '../utils/file-uploads.utils';

@Controller('teacher')
export class TeacherController {


    constructor(
        private teacherService: TeacherService
    ){}

    @Post()
    createTeacher(@Body() createTeacherDto:CreateTeacherDto ){
      return this.teacherService.create(createTeacherDto);
    }

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

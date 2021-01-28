import { StudentService } from '../services/student.service';
import { studentsFileMetadata } from '../utils/studentsFileMetadata.class';
import { BadRequestException, Body, Controller, Get, Post, Req, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer';
import { editFileNameStudents, studentsFileFilter } from '../utils/file-uploads.utils';


@Controller('student')
export class StudentController {

    constructor(
        private studentService: StudentService
    ){}


    //upload excel file of students and geenrate them in db
    //TODO: add guards (Admin only)
    @Post('upload')
    @UseInterceptors(FileInterceptor("students",{
    storage: diskStorage({
        destination:"uploads/students",
        filename:editFileNameStudents,
    }),
    fileFilter:studentsFileFilter
    }))
    async uploadStudents(@UploadedFile() file,@Req() req,@Body() metadata:studentsFileMetadata) {
        if (req.fileValidationError) {
            throw new BadRequestException(req.fileValidationError);
        }

        if (!file) {
            throw new BadRequestException('Fichier Invalide');
        }
    
        return this.studentService.generateStudents(metadata,file.path) 


    }

    //get all 
    @Get()
    findAll(){
        return this.studentService.findAll();
    }
    
}
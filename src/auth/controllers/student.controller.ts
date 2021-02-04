import { CreateStudentDto } from './../dto/create-student';
import { StudentService } from '../services/student.service';
import { studentsFileMetadata } from '../utils/studentsFileMetadata.class';
import {
    BadRequestException, Body,
    Controller, Delete, Get, Param, ParseIntPipe, Post, Put,
    Query,
    Req, UploadedFile, UseInterceptors
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express'
import { diskStorage } from 'multer';
import { editFileNameStudents, studentsFileFilter } from '../utils/file-uploads.utils';
import { Pagination } from 'nestjs-typeorm-paginate';
import { StudentEntity } from '../entities/student.entity';
import {UpdateStudentDto} from "../dto/update-student";



@Controller('student')
export class StudentController {

    constructor(
        private studentService: StudentService
    ){}

    // get paginated
    @Get('paginate')
    async index(
      @Query('page', ParseIntPipe) page = 1,
      @Query('limit', ParseIntPipe) limit = 10,
    ): Promise<Pagination<StudentEntity>> {
      limit = limit > 100 ? 100 : limit;
       return this.studentService.paginate({
         page,
         limit,
         route: 'http://localhost:4200/Students',
       });
    }

    @Post()
    createStudent(@Body() createStudentDto:CreateStudentDto ){
      return this.studentService.create(createStudentDto);
    }

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

    @Get()
    findAll(){
        return this.studentService.findAll();
    }

    @Get(':id')
    findOne(@Param('id') id: string) {
      return this.studentService.findOne(+id);
    }
  
  
    @Delete(':id')
    delete(@Param('id') id: string) {
      return this.studentService.delete(+id);
    }

    @Put(':id')
    async update(
        @Param('id') id: string,
        @Body() updateStudentDto: UpdateStudentDto){
        return await this.studentService.update(id,updateStudentDto);
    }
    
}

import { CreateTeacherDto } from './../dto/create-teacher';
import { TeacherEntity } from 'src/auth/entities/teacher.entity';
import { teachersFileMetadata } from '../utils/teachersFileMetadata.class';
import { BadRequestException, ConflictException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import * as xlsx from 'xlsx';
import { changeKeys, prepareTeacher} from '../utils/prepare-users.utils';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import {StudentEntity} from "../entities/student.entity";
import {
    paginate,
    Pagination,
    IPaginationOptions,
} from 'nestjs-typeorm-paginate';
import { CreateStudentDto } from '../dto/create-student';
import {UpdateStudentDto} from "../dto/update-student";

@Injectable()
export class TeacherService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(TeacherEntity)
        private teacherRepository: Repository<TeacherEntity>,
    ){}

    async create(createTeacherDto: CreateTeacherDto ): Promise<Partial<UserEntity>> {
        try{
            const teacher = await prepareTeacher(createTeacherDto);
            return await this.userRepository.save(teacher);

        }
        catch(e){
          if(e.errno==1062)
            throw new ConflictException(`L'enseigant dejà existe`);
          throw new BadRequestException("Request not accepted")
        }
      }
    

    async generateTeachers(metadata:teachersFileMetadata,filePath){

        const xlsxFile = xlsx.readFile(filePath)    
        const sheet = xlsxFile.Sheets[xlsxFile.SheetNames[0]] 
        var data = xlsx.utils.sheet_to_json(sheet,{raw:true,defval:null})
        console.log(data)
        // check that data not empty 
        if (data.length>0){
            //check that keys match what was sent with the post request
            if (JSON.stringify(Object.keys(data[0])) == 
            JSON.stringify(Object.values(metadata) )){
                try{
                await data.forEach(jsonObj=>changeKeys(jsonObj,Object.keys(metadata)))
                const teachers = []
                for(let i=0;i<data.length;i++){
                    teachers.push(await prepareTeacher(data[i]))
                }
                return await this.userRepository.save(teachers)
                }catch(e){
                    throw new NotAcceptableException('Vérifier les entréss de votre fichier')
                }
            }else{
                throw new NotAcceptableException("Les noms de colonnes ne sont pas identiques")
            }
            
        }else{
            throw new NotAcceptableException("Fichier vide")
        }

    }


    async findAll(): Promise<TeacherEntity[]> {
        const teachers=await this.teacherRepository
        .createQueryBuilder('teacher')
        .select([
            'teacher.id',
            'userDetails.id',
            'userDetails.email',
            'userDetails.nom',
            'userDetails.prenom',
        ])
        .leftJoin('teacher.userDetails', 'userDetails')  // userDetails is the joined table
        .getMany();
        return teachers
      }


      async findOne(id: number): Promise<Partial<TeacherEntity>> {
        const teacher = await this.teacherRepository
        .createQueryBuilder('teacher')
        .select([
            'teacher.id',
            'userDetails.id',
            'userDetails.email',
            'userDetails.nom',
            'userDetails.prenom',
        ])
        .leftJoin('teacher.userDetails', 'userDetails')  // userDetails is the joined table
        .where('teacher.id = :id',{id:id})
        .getOne()
        
        if (teacher)
          return teacher
        throw new NotFoundException(`L'enseignant d'id ${id} n'est pas disponible`);
      }
    
    
      async delete(id: number): Promise<UpdateResult> {
        return await this.teacherRepository.softDelete(id);
      }

    async paginate(options: IPaginationOptions): Promise<Pagination<TeacherEntity>> {
        const queryBuilder = this.teacherRepository
            .createQueryBuilder('teacher')
            .select([
                'teacher.id',
                'userDetails.id',
                'userDetails.email',
                'userDetails.nom',
                'userDetails.prenom',
            ])
            .leftJoin('teacher.userDetails', 'userDetails')

        return paginate<TeacherEntity>(queryBuilder, options);
    }
}

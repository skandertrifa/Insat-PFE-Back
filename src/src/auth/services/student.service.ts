import { StudentEntity } from '../entities/student.entity';
import { BadRequestException, ConflictException, Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import * as xlsx from 'xlsx';
import * as bcrypt from 'bcrypt';
import { studentsFileMetadata } from '../../gestion-soutenance/utils/studentsFileMetadata.class';
import { changeKeys, prepareStudent } from '../../gestion-soutenance/utils/prepare-users.utils';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';
import {
    paginate,
    Pagination,
    IPaginationOptions,
  } from 'nestjs-typeorm-paginate';
import { CreateStudentDto } from '../dto/create-student';

@Injectable()
export class StudentService {

    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(StudentEntity)
        private studentRepository: Repository<StudentEntity>,
    ){}


    async create(createStudentDto: CreateStudentDto ): Promise<Partial<UserEntity>> {
        try{
            const student = await prepareStudent(createStudentDto);
            return await this.userRepository.save(student);

        }
        catch(e){
          if(e.errno==1062)
            throw new ConflictException(`L'etudiant dejà existe`);
          throw new BadRequestException("Request not accepted")
        }
      }

      
    async generateStudents(metadata:studentsFileMetadata,filePath){

        const xlsxFile = xlsx.readFile(filePath)    
        const sheet = xlsxFile.Sheets[xlsxFile.SheetNames[0]] 
        var data = xlsx.utils.sheet_to_json(sheet,{raw:true,defval:null})
        // check that data not empty 
        if (data.length>0){
            //check that keys match what was sent with the post request
            if (JSON.stringify(Object.keys(data[0])) == 
            JSON.stringify(Object.values(metadata) )){
                try{
                await data.forEach(jsonObj=>changeKeys(jsonObj,Object.keys(metadata)));
                const users = []
                for(let i=0;i<data.length;i++){
                    users.push(await prepareStudent(data[i]))
                }
                return await this.userRepository.save(users);
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

    async findAll(): Promise<StudentEntity[]> {
        // const students=await this.studentRepository.find({
        //     //relations:['userDetails']
        //     select: [
        //         "cin",
        //         "filiere",
        //         "sujet",
        //         "id",
        //         "userDetails",
        //     ],

        // });
        /* const students=await this.studentRepository
        .createQueryBuilder('student')
        .select([
            'student.id',
            'student.idEtudiant',
            'student.cin',
            'student.filiere',
            'student.sujet',
            'userDetails.id',
            'userDetails.email',
            'userDetails.nom',
            'userDetails.prenom',
        ])
        .leftJoin('student.userDetails', 'userDetails')  // userDetails is the joined table
        .getMany(); */
        const students = await this.studentRepository.find()
        return students
      }

      async paginate(options: IPaginationOptions): Promise<Pagination<StudentEntity>> {
        const queryBuilder = this.studentRepository
        .createQueryBuilder('student')
        .select([
            'student.id',
            'student.idEtudiant',
            'student.cin',
            'student.filiere',
            'student.sujet',
            'userDetails.id',
            'userDetails.email',
            'userDetails.nom',
            'userDetails.prenom',
        ])
        .leftJoin('student.userDetails', 'userDetails')
    
        return paginate<StudentEntity>(queryBuilder, options);
      }
      

      async findOne(id: number): Promise<Partial<StudentEntity>> {
        const student = await this.studentRepository
        .createQueryBuilder('student')
        .select([
            'student.id',
            'student.idEtudiant',
            'student.cin',
            'student.filiere',
            'student.sujet',
            'userDetails.id',
            'userDetails.email',
            'userDetails.nom',
            'userDetails.prenom',
        ])
        .leftJoin('student.userDetails', 'userDetails')  // userDetails is the joined table
        .where('student.id = :id',{id:id})
        .getOne()
        
        if (student)
          return student
        throw new NotFoundException(`L'etudiant d'id ${id} n'est pas disponible`);
      }
    
    
      async delete(id: number): Promise<StudentEntity> {
        //return await this.studentRepository.softDelete(id);
         try{
        const student = await this.studentRepository.findOne(id,{relations:['userDetails']})
        console.log(student)
        return await this.studentRepository.softRemove(student);

      }catch(e){
        throw new NotFoundException('Impossible de supprimer cet etudiant')
      } 
}

}

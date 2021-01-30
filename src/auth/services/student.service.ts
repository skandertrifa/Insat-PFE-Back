import { StudentEntity } from '../entities/student.entity';
import { Injectable, NotAcceptableException } from '@nestjs/common';
import * as xlsx from 'xlsx';
import { studentsFileMetadata } from '../utils/studentsFileMetadata.class';
import { changeKeys, prepareStudents } from '../utils/prepare-users.utils';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository } from 'typeorm';
import {
    paginate,
    Pagination,
    IPaginationOptions,
  } from 'nestjs-typeorm-paginate';

@Injectable()
export class StudentService {

    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(StudentEntity)
        private studentRepository: Repository<StudentEntity>,
    ){}
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
                await data.forEach(jsonObj=>changeKeys(jsonObj,Object.keys(metadata)))
                const users = await prepareStudents(data)
                return await this.userRepository.save(users)
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
        const students=await this.studentRepository
        .createQueryBuilder('student')
        .select([
            'student.id',
            'student.cin',
            'student.filiere',
            'student.sujet',
            'userDetails.id',
            'userDetails.email',
            'userDetails.nom',
            'userDetails.prenom',
        ])
        .leftJoin('student.userDetails', 'userDetails')  // userDetails is the joined table
        .getMany();
        return students
      }

      async paginate(options: IPaginationOptions): Promise<Pagination<StudentEntity>> {
        const queryBuilder = this.studentRepository.createQueryBuilder('student').select([
            'student.id',
            'student.cin',
            'student.filiere',
            'student.sujet',
            'userDetails.id',
            'userDetails.email',
            'userDetails.nom',
            'userDetails.prenom',
        ])
        .leftJoin('student.userDetails', 'userDetails');
    
        return paginate<StudentEntity>(queryBuilder, options);
      }
}

import { TeacherEntity } from 'src/auth/entities/teacher.entity';
import { teachersFileMetadata } from '../utils/teachersFileMetadata.class';
import { Injectable, NotAcceptableException, NotFoundException } from '@nestjs/common';
import * as xlsx from 'xlsx';
import { changeKeys, prepareTeachers } from '../utils/prepare-users.utils';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from '../entities/user.entity';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class TeacherService {
    constructor(
        @InjectRepository(UserEntity)
        private userRepository: Repository<UserEntity>,
        @InjectRepository(TeacherEntity)
        private teacherRepository: Repository<TeacherEntity>,
    ){}
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
                const users = await prepareTeachers(data)
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
}

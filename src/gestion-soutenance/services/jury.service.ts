import { JuryEntity } from './../entities/jury.entity';
import { TeacherEntity } from 'src/auth/entities/teacher.entity';
import { JuryDto } from '../dto/jury.dto';
import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class JuryService {

    constructor(
        @InjectRepository(JuryEntity)
        private readonly juryRepositroy: Repository<JuryEntity>,
        @InjectRepository(TeacherEntity)
        private readonly teacherRepositroy: Repository<TeacherEntity>
    ){}

    async create(juryDto:JuryDto):Promise<JuryEntity>{
        //load teachers
        const members = await this.teacherRepositroy.findByIds(juryDto.members)
        const president = await this.teacherRepositroy.findOne(juryDto.president)
        //create jury
        if ((president) && (members.length === juryDto.members.length)){
            const jury = this.juryRepositroy.create({president,members})
            try{
                return await this.juryRepositroy.save(jury);
            }catch(e){
                console.log(e);
                throw new BadRequestException("Request not accepted")
            }
        }else{
            throw new BadRequestException("Enseignant inexistant ! ")
        }
    }

    async update(juryUpdate:JuryDto,id:number): Promise<JuryEntity>{
        //load teachers
        const members = await this.teacherRepositroy.findByIds(juryUpdate.members)
        const president = await this.teacherRepositroy.findOne(juryUpdate.president)
        //create jury
        if ((president) && (members.length === juryUpdate.members.length)){
            
            try{
                const jury = await this.juryRepositroy.findOne(id)
                if (!jury){
                    new NotFoundException(`La jury d'id ${id} n'existe pas`);
                }else{
                    return await this.juryRepositroy.save({
                        ...jury,
                        members:members,
                        president:president
                    });
                }
                
            }catch(e){
                console.log(e);
                throw new BadRequestException("Request not accepted")
            }
        }else{
            throw new BadRequestException("Enseignant inexistant ! ")
        }
    }
    
    async findAll(): Promise<JuryEntity[]> {
        const juries=await this.juryRepositroy.find({relations:['president','members']});
        return juries
      }


    async findOne(id:number): Promise<JuryEntity> {
        const jury=await this.juryRepositroy.findOne(id,
            {relations:['members','president']
        })
        if (jury){
            return jury
        }
        throw new NotFoundException(`Le jury d'id ${id} n'est pas disponible`);
    }

    async delete(id:number):Promise<UpdateResult> {
        return await this.juryRepositroy.softDelete(id);
    }


}

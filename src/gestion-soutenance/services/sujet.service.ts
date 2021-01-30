import { SujetDto } from '../dto/sujet.dto';
import { SujetEntity } from '../entities/sujet.entity';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { StudentEntity } from 'src/auth/entities/student.entity';

@Injectable()
export class SujetService {
    constructor(
        @InjectRepository(SujetEntity)
        private readonly sujetRepositroy: Repository<SujetEntity>,
        @InjectRepository(StudentEntity)
        private readonly etudiantRepository:Repository<StudentEntity>
    ){}

    async length():Promise<number>{
        return this.sujetRepositroy.count()
      }
    async create(sujetDto:SujetDto):Promise<SujetEntity>{
        try{
            const etudiant = await this.etudiantRepository.findOne(sujetDto.idEtudiant)
            const sujet = await this.sujetRepositroy.create({
                etudiant:etudiant,
                description:sujetDto.description,
                dateLimiteDepot:sujetDto.dateLimiteDepot,
                titre:sujetDto.titre
            });
            return await this.sujetRepositroy.save(sujet);
        }
        catch(e){
            if(e.errno==1062)
                throw new ConflictException(`Un Sujet de meme titre existe dejà.`);
            throw new BadRequestException("Request not accepted")
        }

    }

    async findAll(): Promise<SujetEntity[]> {
        const sujets=await this.sujetRepositroy.find();
        return sujets
      }

      async findAllPaginated(page:number): Promise<any> {
        if(page<=0)
          page=1
        const limit=10
        const sujets=await this.sujetRepositroy.find({relations:['etudiant'],skip:limit*(page-1),take:limit })



        const paginationMeta= {
          "currentPage": page,
          "itemsPerPage": limit,
          "totalPages": Math.ceil(await this.length()/limit),
        }
    
        return {"items":sujets,...paginationMeta}
      }

    async findOne(id:number): Promise<SujetEntity> {
        const sujet=await this.sujetRepositroy.findOne(id);
        if (sujet){
            return sujet
        }
        throw new NotFoundException(`Le sujet d'id ${id} n'est pas disponible`);
    }

    async update(id:number,sujetDto:SujetDto):Promise<SujetEntity>{
        const sujet =  await this.sujetRepositroy.preload(
            {
            id:+id,
            ...sujetDto
            }
        );
        if (!sujet) {
            new NotFoundException(`La sujet d'id ${id} n'existe pas`);
          }
          return await this.sujetRepositroy.save(sujet)

    }
    async delete(id:number):Promise<UpdateResult> {
        return await this.sujetRepositroy.softDelete(id);
    }
}

import { SujetDto } from '../dto/sujet.dto';
import { SujetEntity } from '../entities/sujet.entity';
import { BadRequestException, ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';

@Injectable()
export class SujetService {
    constructor(
        @InjectRepository(SujetEntity)
        private readonly sujetRepositroy: Repository<SujetEntity>
    ){}

    async create(sujetDto:SujetDto):Promise<SujetEntity>{
        const sujet = this.sujetRepositroy.create(sujetDto);
        try{
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

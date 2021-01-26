import {  Repository, UpdateResult } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { AnneeEntity } from '../entities/annee.entity';
import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { AnneeDto } from '../dto/annee.dto';


@Injectable()
export class AnneeService {
  constructor(
    @InjectRepository(AnneeEntity)
    private readonly AnneeRepository: Repository<AnneeEntity>
  ) {}
  async create(anneeDto: AnneeDto): Promise<Partial<AnneeEntity>> {
    console.log({...anneeDto})
    try{

      const annee =  this.AnneeRepository.create({...anneeDto});
    
    return await this.AnneeRepository.save(annee);
    }
    catch(e){
      if(e.errno==1062)
        throw new ConflictException(`L'annee est deja existante`);
      throw new BadRequestException("Request not accepted")
    }
  }

  async findAll(): Promise<Partial<AnneeEntity[]>> {
    const annees=await this.AnneeRepository.find()
    return annees
  }

  async findOne(id: number): Promise<Partial<AnneeEntity>> {
    const annees = await this.AnneeRepository.find({id});
    if (annees[0])
      return annees[0]
    throw new NotFoundException(`L'annee d'id ${id} n'est pas disponible`);
  }

  async update(id: number, updateDto: AnneeDto): Promise<Partial<AnneeEntity>> {
    const annee = await this.AnneeRepository.preload({
      id: id,
      ...updateDto
    });
    if (!annee) {
      new NotFoundException(`L'annee' d'id ${id} n'existe pas`);
    }
    return annee
  }

  async delete(id: number): Promise<UpdateResult> {
    
    return await this.AnneeRepository.softDelete(id);

    
  }
}

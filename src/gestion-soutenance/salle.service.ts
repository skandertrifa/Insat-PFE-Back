import { Repository, UpdateResult } from 'typeorm';
import { SalleEntity } from './entities/salle.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Injectable, NotFoundException, ConflictException, BadRequestException } from '@nestjs/common';
import { CreateSalleDto } from './dto/create-salle.dto';
import { UpdateSalleDto } from './dto/update-salle.dto';

@Injectable()
export class SalleService {
  constructor(
    @InjectRepository(SalleEntity)
    private readonly salleRepository: Repository<SalleEntity>
  ) {}
  async create(createSalleDto: CreateSalleDto): Promise<Partial<SalleEntity>> {
    try{
      const salle =  this.salleRepository.create({...createSalleDto});
      return await this.salleRepository.save(salle);
    }
    catch(e){
      if(e.errno==1062)
        throw new ConflictException(`L'annee est deja existante`);
      throw new BadRequestException("Request not accepted")
    }
  }

  async findAll(): Promise<Partial<SalleEntity[]>> {
    const salles=await this.salleRepository.find()
    return salles
  }

  async findOne(id: number): Promise<Partial<SalleEntity>> {
    const salles = await this.salleRepository.find({id});
    if (salles[0])
      return salles[0]
    throw new NotFoundException(`La salle d'id ${id} n'est pas disponible`);
  }

  async update(id: number, updateSalleDto: UpdateSalleDto): Promise<Partial<SalleEntity>> {
    const salle = await this.salleRepository.preload({
      id: +id,
      ...updateSalleDto
    });
    if (!salle) {
      new NotFoundException(`La salle d'id ${id} n'existe pas`);
    }
    return await this.salleRepository.save(salle)
  }

  async delete(id: number): Promise<UpdateResult> {
    return await this.salleRepository.softDelete(id);
  }
}

import { SessionService } from './../gestion-session/session.service';
import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateSoutenanceDto } from './dto/create-soutenance.dto';
import { UpdateSoutenanceDto } from './dto/update-soutenance.dto';
import { SoutenanceEntity } from './entities/soutenance.entity';
import { SalleService } from './salle.service';
import { SujetService } from './sujet.service';

const relations=["session","salle","sujet"]

@Injectable()
export class SoutenanceService {
  
  constructor(
    @InjectRepository(SoutenanceEntity)
    private readonly soutenanceRepository: Repository<SoutenanceEntity>,
    @Inject(forwardRef(() => SalleService)) 
    private readonly salleService: SalleService,
    @Inject(forwardRef(() => SessionService)) 
    private readonly sessionService: SessionService,
    @Inject(forwardRef(() => SujetService)) 
    private readonly sujetService: SalleService
  ) {}
  async getRelationEntities(dto)
  {
    const objects={}
    
    if (typeof dto.salleId!= "undefined")
      objects["salle"]= await this.salleService.findOne(dto.salleId)
    if (typeof dto.sessionId!= "undefined")
      objects["session"]= await this.sessionService.findOne(dto.sessionId)
    if (typeof dto.sujetId!= "undefined")
      objects["sujet"]= await this.sujetService.findOne(dto.sujetId)

    return objects
  }
  async create(createSoutenanceDto: CreateSoutenanceDto): Promise<Partial<SoutenanceEntity>> {
    
    const objects=await this.getRelationEntities(createSoutenanceDto)
    console.log("objects : ",objects)
    const Soutenance =  await this.soutenanceRepository.create({...createSoutenanceDto,...objects});
    return await this.soutenanceRepository.save(Soutenance);
    
  }
  

  async findAll(): Promise<Partial<SoutenanceEntity[]>> {
    const Soutenances=await this.soutenanceRepository.find({ relations: relations })
    return Soutenances
  }

  async findOne(id: number): Promise<Partial<SoutenanceEntity>> {
    const Soutenance = await this.soutenanceRepository.findOne(id,{relations:relations});
    if (Soutenance)
      return Soutenance
    throw new NotFoundException(`La Soutenance d'id ${id} n'est pas disponible`);
  }

  async update(id: number, updateSoutenanceDto: UpdateSoutenanceDto): Promise<Partial<SoutenanceEntity>> {
    const objects=await this.getRelationEntities(updateSoutenanceDto)
    const Soutenance = await this.soutenanceRepository.preload({
      id: +id,
      ...updateSoutenanceDto,
      ...objects
    });
    if (!Soutenance) {
      new NotFoundException(`La Soutenance d'id ${id} n'existe pas`);
    }
    return await this.soutenanceRepository.save(Soutenance)
  }

  async delete(id: number): Promise<UpdateResult> {
    
    return await this.soutenanceRepository.softDelete(id);
 
  }
}
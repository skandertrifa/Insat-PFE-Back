import { SessionService } from '../../gestion-session/services/session.service';
import { forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, UpdateResult } from 'typeorm';
import { CreateSoutenanceDto } from '../dto/create-soutenance.dto';
import { UpdateSoutenanceDto } from '../dto/update-soutenance.dto';
import { SoutenanceEntity } from '../entities/soutenance.entity';
import { SalleService } from './salle.service';
import { SujetService } from './sujet.service';
import { JuryService } from './jury.service';

const relations=["session","salle","sujet","jury"]

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
    private readonly sujetService: SujetService,
    @Inject(forwardRef(() => JuryService)) 
    private readonly juryService: JuryService
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
    if (typeof dto.juryId!= "undefined")
      objects["jury"]= await this.sujetService.findOne(dto.juryId)

    return objects
  }
  async create(createSoutenanceDto: CreateSoutenanceDto): Promise<Partial<SoutenanceEntity>> {
    
    const objects=await this.getRelationEntities(createSoutenanceDto)
    //console.log("objects : ",objects)
    const Soutenance =  await this.soutenanceRepository.create({...createSoutenanceDto,...objects});
    console.log("soutenance creation : ",Soutenance)
    return await this.soutenanceRepository.save(Soutenance);
    
  }
  

  async findAll(): Promise<SoutenanceEntity[]> {
    const Soutenances=await this.soutenanceRepository.find({ relations: relations })
    for (const soutenance of Soutenances){
      soutenance.session = await this.sessionService.findOne(soutenance.session.id);
    }
    return Soutenances
  }

  async findOne(id: number): Promise<SoutenanceEntity> {
    const Soutenance = await this.soutenanceRepository.findOne(id,{relations:relations});
    console.log("soutenance : ",Soutenance)
    if (Soutenance){
      Soutenance.session = await this.sessionService.findOne(Soutenance.session.id);
      Soutenance
    }

      
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

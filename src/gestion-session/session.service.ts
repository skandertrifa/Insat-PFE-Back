import { AnneeService } from './../gestion-annee/annee.service';
import { Repository } from 'typeorm';
import { SessionEntity } from './entities/session.entity';
import { InjectRepository } from '@nestjs/typeorm';
import {  forwardRef, Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateSessionDto } from './dto/create-session.dto';
import { UpdateSessionDto } from './dto/update-session.dto';
import { UpdateResult } from 'typeorm';

@Injectable()

export class SessionService {
  constructor(
    @InjectRepository(SessionEntity)
    private readonly sessionRepository: Repository<SessionEntity>,
    
    @Inject(forwardRef(() => AnneeService)) 
    private readonly anneeService: AnneeService
  ) {}
  async create(createSessionDto: CreateSessionDto): Promise<Partial<SessionEntity>> {

    const anneeId=createSessionDto.anneeId
    const annee= await this.anneeService.findOne(anneeId)
    const session =  await this.sessionRepository.create({...createSessionDto,annee:annee,});
    return await this.sessionRepository.save(session);
    
  }
  

  async findAll(): Promise<Partial<SessionEntity[]>> {
    const sessions=await this.sessionRepository.find({ relations: ['annee'] })
    return sessions
  }

  async findOne(id: number): Promise<Partial<SessionEntity>> {
    const session = await this.sessionRepository.findOne(id,{relations:['annee']});
    if (session)
      return session
    throw new NotFoundException(`La session d'id ${id} n'est pas disponible`);
  }

  async update(id: number, updateSessionDto: UpdateSessionDto): Promise<Partial<SessionEntity>> {
    const annee={}
    if(typeof updateSessionDto.anneeId!="undefined"){
      const anneeID=updateSessionDto.anneeId
      annee["annee"]=await this.anneeService.findOne(anneeID)
    }
    const session = await this.sessionRepository.preload({
      id: +id,
      ...updateSessionDto,
      ...annee
    });
    if (!session) {
      new NotFoundException(`La session d'id ${id} n'existe pas`);
    }
    return await this.sessionRepository.save(session)
  }

  async delete(id: number): Promise<UpdateResult> {
    
    return await this.sessionRepository.softDelete(id);
 
  }
}
